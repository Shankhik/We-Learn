import * as React from 'react';
import {Html, Body, Container, Tailwind, Text, Hr, Img} from '@react-email/components'

export default function ForgotPwdEmail({user, otp}:{user:string; otp: number}) {

    return(
        <Html>
            <Tailwind>
            <Body style={{
                padding:'5dvh 10px 5dvh 10px',
                minHeight:'fit-content',
                background:'linear-gradient(70deg,rgb(223, 172, 157),rgb(167, 146, 224))',
                fontFamily:"Calibri"
            }}>
                
                <Container style={{
                    padding:'20px 30px 0px 30px',
                    margin:'30px auto 30px auto',
                    background:'rgb(255, 255, 255)',
                    borderRadius:'20px',
                }}>
                    <div style={{marginTop:'10px'}}>
                        <Img src='https://raw.githubusercontent.com/Shankhik/Web-Assets/8c5ab1169cb950b8beebeaabbc000fdcab8c3883/We-Learn/Emails/logo-compact.png'
                            style={{width:'80px', margin:'20px auto 30px auto'}}
                        />
                    </div>
                    <Hr/>

                    
                    <Text className='text-[1rem]'>
                        Hello <strong>{user || 'user'}</strong>! It seems like you have requested for a password change.
                    </Text>
                    <Text className='text-[1rem]'>This OTP is valid for only 10mins</Text>
                    <Text className='text-[2rem]' style={{
                        margin:'0 auto',
                        padding: '20px 0px 20px 10px',
                        width:'140px',
                        textAlign:'center',
                        letterSpacing: '10px',
                        fontWeight:'800',
                        borderRadius:'10px',
                        background:"rgb(235, 219, 255)",
                        color: 'rgb(173, 117, 169)'
                    }}>
                        {otp || '4567'}
                    </Text>
                    <Text className='text-[1rem]'>
                        If this <strong>{`isn't`}</strong> you, change your password immediately.
                    </Text>
                    <Hr style={{marginTop:'20px'}}/>
                    <Text style={{color:'rgb(172, 172, 172)', fontSize:'0.8rem', textAlign:'center'}}>This Email is computer generated. <strong>Do Not</strong> Reply to this Email Address</Text>
                </Container>
            </Body>
            </Tailwind>
        </Html>
    )
}