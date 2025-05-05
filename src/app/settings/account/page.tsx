'use client'
import WaitingSVG from '@/app/settings/waitingSvg';
import {CSSProperties} from "react";
export default function Account() {
    const iconStyle:CSSProperties = {
        width:'100%', height:'40dvh',
    }
    return(
        <div className={'settings-content-pages'}>
            <div style={{
                display:'flex',alignItems:"center",flexDirection:'column',
                marginTop: '5%'
            }}>
                <WaitingSVG style={iconStyle}/>
                <h2 style={{margin:'3% 0 20px 0'}}>Under Development!</h2>
                <h3>Please wait for the next patch.</h3>
            </div>

        </div>
    )
}