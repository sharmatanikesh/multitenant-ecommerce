import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from '@payload-config'
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";



export async function POST(req: Request) { 
    let event: Stripe.Event;

    try {

        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get("stripe-signature") as string,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        if (error instanceof Error) { 
            console.log(error)
        }
        console.log(`❌ Error message: ${errorMessage}`);
        return NextResponse.json(
            {
                message:`Webhook Error: ${errorMessage}`,
            },
            {
                status: 400
            }
        )
    }

    console.log("✅ Success:", event.id);
    console.log("📋 Event type:", event.type);

    const permittedEvents: string[] = [
        "checkout.session.completed",
    ]

    const payload = await getPayload({ config });

    if(permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) { 
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;
                    console.log(" ❤️Checkout session completed:", data.id);
                    console.log("METADATA",data.metadata)
                    console.log("❤️Session metadata:", data.metadata);
                    
                    // Handle missing metadata for testing
                    if (!data.metadata?.userId) {
                        console.log("⚠️ No userId in metadata - skipping order creation for test session");
                        return NextResponse.json(
                            { message: "Test session - no order created" },
                            { status: 200 }
                        );
                    }

                    const user = await payload.findByID({
                        collection: "users",
                        id: data.metadata.userId,
                    })

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const expandedSession = await stripe.checkout.sessions.retrieve(
                        data.id,
                        {
                            expand: ["line_items", "line_items.data.price.product"]
                        }
                    )

                    if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
                        throw new Error("No line items found")
                    }

                    const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

                    for (const item of lineItems) {
                        await payload.create({
                            collection: "orders",
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id,
                                product: item.price.product.metadata.id,
                                name:item.price.product.name
                            }
                        })
                    }
                    break;
                default:
                    throw new Error(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.log(error);

            return NextResponse.json(
                { message: "Webhook handler failed" },
                {status:500}
            )
        }
    }
    
    return NextResponse.json(
        { message: "Received" },
        {status: 200,}
    )
}