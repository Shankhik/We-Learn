import Dashboard from "./Dashboard"

export default async function Page (){
    return <Dashboard note={getWelcomeNote()}/>
}
const getWelcomeNote = ()=>{
    const hours = new Date().getHours()
    const greating = {
        'morning': `Good morning`,
        'afternoon': `Good afternoon`,
        'evening': `Good evening`,
        'night': `Wow! You're still up?`
    }
    const notes = {
        '0': `Welcome <--Display-Name-->!`,
        '1': `Hope you're doing well!`,
        '2': `${hours<12? greating.morning:
            hours<17? greating.afternoon: greating.evening
        } <--Display-Name-->!`
    }
    if(hours<5)
        return greating['night'];
    else{
        return notes[(Math.floor(Math.random() * 3)).toString() as '0'|'1'|'2']
    }
}