import Welcome from "./emails/Welcome"
import OtpVerification from "./emails/OtpVerification";

import type { ComponentProps } from "react";

type EmailProps = {
    Welcome: ComponentProps<typeof Welcome>,
    OtpVerification: ComponentProps<typeof OtpVerification>,
}

export const emailRenderMap = [
    {
        name: "Welcome",
        getComponent: ()=> Welcome,
        Component: Welcome,
        props: {
            // inPreview: true,
            username: "PeaceKeeperOP"
        } satisfies EmailProps['Welcome'],
    },
    {
        name: "Otp Verification",
        getComponent: ()=> OtpVerification,
        Component: OtpVerification,
        props: {
            // inPreview: true,
            purpose: "Email Verification",
            otp: "962736",
            sessionExpireTime: "8mins"
            // otpExpireTime: "10mins"
        } satisfies EmailProps["OtpVerification"],
    },
]