import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

export const Banner: React.FC<{ close: () => void }> = ({ close }) => {
    return (
        <div className="z-10 hidden sm:block fixed inset-x-0 bottom-0">
            <div className="bg-gray-600">
                <div className="max-w-7xl mx-auto py-3 px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap">
                        <span className="flex p-2 rounded-lg bg-gray-800">
                            <ExclamationTriangleIcon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                            />
                        </span>
                        <p className="ml-3 font-medium text-white truncate text-center">
                            <span className="text-center">
                                This is a hobby website - information and images
                                may be inaccurate
                            </span>
                        </p>
                        <div className="flex-shrink-0 order-3 ml-3">
                            <button
                                type="button"
                                className="flex p-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-white -mr-2"
                                onClick={close}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon
                                    className="h-6 w-6 text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
