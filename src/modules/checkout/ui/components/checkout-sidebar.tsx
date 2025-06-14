import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import { format } from "path";

interface CheckoutSidebarProps {
    total: number;
    onCheckout: () => void;
    isCanceled?: boolean;
    isPending?: boolean;
}

export const CheckoutSidebar = ({
    total,
    onCheckout,
    isCanceled = false,
    isPending = false
}: CheckoutSidebarProps) => { 
    return (
        <div className="border rounded-md overflow-hidden bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium text-lg">Total</h4>
                <p className="font-bold text-lg">
                    {formatCurrency(total)}
                </p>
            </div>
            <div className="p-4 items-center justify-center ">
                <Button
                    variant="elevated"
                    disabled={isPending}
                    onClick={onCheckout}
                    size="lg"
                    className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary">
                        Checkout
                </Button>
            </div>

            {isCanceled && (
                <div className="p-4 items-center justify-center border-t">
                    <div className="bg-red-100 border border-red-400 font-medium w-full px-4 py-3 rounded flex items-center">
                        <div className="flex items-center">
                            <CircleIcon className="size-6 mr-2 fill-red-500 text-red-100" />
                            <span className=""
                            >Checkout failed. Please try again</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}