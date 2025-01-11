import * as React from 'react';
import {Html, Body, Heading, Img, Container, Tailwind, Head, Text, Link, Hr} from '@react-email/components'

export default function SignupEmail({user}:{user:string}) {

    return(
        <Html>
            <Tailwind>
            <Body style={{
                padding:'5dvh 10px 5dvh 10px',
                minHeight:'fit-content',
                background:'linear-gradient(90deg,rgb(201, 223, 208),rgb(146, 185, 224))',
                fontFamily:"Calibri"
            }}>
                
                <Container style={{
                    padding:'20px 30px 0px 30px',
                    margin:'30px auto 30px auto',
                    background:'rgb(255, 255, 255)',
                    borderRadius:'20px',
                    boxShadow:'0px 0px 10px rgba(35, 84, 124, 0.58)'
                }}>
                    <Container style={{marginTop:'10px'}}>
                        <Img src='https://raw.githubusercontent.com/Shankhik/Web-Assets/8c5ab1169cb950b8beebeaabbc000fdcab8c3883/We-Learn/Emails/logo-compact.png'
                            style={{width:'80px', margin:'20px auto 10px auto'}}
                        />
                    </Container>
                    <Container>
                        <Img src='https://raw.githubusercontent.com/Shankhik/Web-Assets/8c5ab1169cb950b8beebeaabbc000fdcab8c3883/We-Learn/Emails/welcome-text.png'
                            style={{width:'160px', margin:'10px auto 20px auto'}}
                        />
                    </Container>

                    <Text className='text-[1rem]'>Hello <strong>{user||'User'}</strong> !</Text>
                    <Text className='text-[1rem]'>Welcome to WeLearn! {"We're"} thrilled to have you on board. ☺️</Text>
                    <Text className='text-[1rem]'>
                        Checkout your <Link href={'https://we-learn.onrender.com/home/dashboard'}>Dashboard</Link>.
                    </Text>
                    <Hr style={{marginTop:'50px'}}/>
                    <Text style={{color:'rgb(172, 172, 172)', fontSize:'0.8rem', textAlign:'center'}}>This Email is computer generated. <strong>Do Not</strong> Reply to this Email Address</Text>
                </Container>
            </Body>
            </Tailwind>
        </Html>
    )
}