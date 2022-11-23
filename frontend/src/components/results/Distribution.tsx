import React from "react";

import { DistributionMap, DistributionRegion } from "../../types/result";

// TODO: These may be inaccurate.
const locations: { [state: string]: string } = {
    CaI: "Cartier Island",
    MDI: "McDonald Island",
    HI: "Heard Island",
    CSI: "Coral Sea Islands",
    AR: "Ashmore Reef",
    MI: "Macquarie Island",
    CoI: "Cocos Island",
    ChI: "Christmas Island",
    LHI: "Lord Howe Island",
    NI: "Norfolk Island",
    ACT: "ACT",
    Tas: "Tasmania",
    SA: "South Australia",
    NT: "Nothern Territory",
    Vic: "Victoria",
    NSW: "New South Wales",
    Qld: "Queensland",
    WA: "Western Australia",
};

/**
 * Show a taxon's region distribution as tags.
 */
export const Distribution: React.FC<{ distribution: DistributionMap }> = ({
    distribution,
}) => {
    const { Australia, ...distributionRegions } = distribution;
    return (
        <div className="flex mb-1 flex-wrap -m-1">
            {(Object.keys(distributionRegions) as DistributionRegion[]).map(
                (region) => (
                    <div
                        key={region}
                        className="border border-gray-200 p-2 bg-gray-50 rounded m-1"
                    >
                        {locations[region] || region}{" "}
                        {distributionRegions[region]?.native ? null : (
                            <span>
                                (
                                {Object.keys(distributionRegions[region]!).join(
                                    " and "
                                )}
                                )
                            </span>
                        )}
                    </div>
                )
            )}
        </div>
    );
};
