import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

type UseTimerResult = {
    timeLeft: number;
    start: () => void;
    rest: () => void;
    set: (seconds: number) => void;
};

const clampSeconds = (seconds: number) => Math.max(0, Math.floor(seconds));

const useTimer2 = (initialSeconds: number): UseTimerResult => {
    const normalizedInitial = clampSeconds(initialSeconds);
    const [timeLeft, setTimeLeft] = useState<number>(normalizedInitial);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentSecondsRef = useRef<number>(normalizedInitial);
    const targetSecondsRef = useRef<number>(normalizedInitial);

    // Clears timer interval
    const clearIntervalRef = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Actual Countdown
    const tick = useCallback(() => {
        currentSecondsRef.current = Math.max(0, currentSecondsRef.current - 1);
        setTimeLeft(currentSecondsRef.current);

        if (currentSecondsRef.current <= 0) {
            clearIntervalRef();
        }
    }, [clearIntervalRef]);

    const start = useCallback(() => {
        if (intervalRef.current !== null) {
            return;
        }

        if (currentSecondsRef.current <= 0) {
            currentSecondsRef.current = targetSecondsRef.current;
            setTimeLeft(currentSecondsRef.current);
        }

        if (currentSecondsRef.current <= 0) {
            return;
        }

        intervalRef.current = setInterval(tick, 1000);
    }, [tick]);

    const rest = useCallback(() => {
        clearIntervalRef();
        currentSecondsRef.current = targetSecondsRef.current;
        setTimeLeft(currentSecondsRef.current);
    }, [clearIntervalRef]);

    const setTimer = useCallback((seconds: number) => {
        const nextSeconds = clampSeconds(seconds);
        targetSecondsRef.current = nextSeconds;
        currentSecondsRef.current = nextSeconds;
        setTimeLeft(nextSeconds);
    }, []);

    useEffect(() => {
        return () => {
            clearIntervalRef();
        };
    }, [clearIntervalRef]);

    return {
        timeLeft,
        start,
        rest,
        set: setTimer,
    };
};

// export default useTimer;

export const useTimer = (initialTimeout: number)=>{
    // Saved timer count;
    const [timerCount, setTimerCount] = useState(clampSeconds(initialTimeout));

    // Time Left in Seconds
    const [timeLeft, setTimeLeft] = useState(timerCount);    
    
    // Updates on prop change
    useEffect(()=>{
        setTimerCount(clampSeconds(initialTimeout))
    },[initialTimeout]);

    useEffect(()=>{
        setTimeLeft(timerCount);
        setTimerState("off");
    },[timerCount]);

    
    const hasEnded = useRef(timeLeft<=0); // -> During Initialization

    // Interval Reference
    const intervalRef = useRef<NodeJS.Timeout|null>(null);

    const [timerState, setTimerState] = useState<'off'|'running'>('off');
    
    const countdown = useEffectEvent(()=>{
        if (timeLeft<=0) {
            hasEnded.current = true;
            // Clears interval
            setTimerState("off");
        }
        // Counts down
        setTimeLeft(prev => Math.max(0, prev-1));
    });

    const update = useCallback((newTimer: number)=>{
        const nextTimer = clampSeconds(newTimer);

        hasEnded.current = false;
        
        
        // Update Timer Count and time left immediately
        setTimerCount(nextTimer);
        // setTimeLeft(nextTimer);


        // clearInterval(intervalRef.current ?? undefined);
        // intervalRef.current = null;
        setTimerState("off");

        
    },[]);

    const start = useCallback(()=>{
        // Resets to False
        hasEnded.current = false;

        // Resets Time Left
        setTimeLeft(timerCount);

        // Change Timer State
        setTimerState("running");
    },[timerCount]);

    const reset = useCallback(()=>{
        setTimerState("off");
    },[]);

    // Handles Timer State Actions
    useEffect(()=>{
        if (timerState==='running'){
            // Clears Existing Interval
            clearInterval(intervalRef.current??undefined);
            
            // Start new interval
            intervalRef.current = setInterval(countdown, 1000);
        } else{
            // Resets Interval
            clearInterval(intervalRef.current??undefined);
            intervalRef.current = null;

            // resets timeleft on -> reset | update
            if (!hasEnded.current)
                setTimeLeft(timerCount);
        }
    },[timerState]);

    // Clears Interval on UNMOUNT
    useEffect(()=>{
        return ()=>{
            clearInterval(intervalRef.current??undefined);
            intervalRef.current = null;
        }
    },[]);

    return {
        timeLeft, start, update, reset, timerState
    }
}

export default useTimer;

export const useCountdown = (time: number)=>{
    // Default Time
    const [countdownTime, setCountdownTime] = useState(clampSeconds(time));
    
    const [timeLeft, setTimeLeft] = useState(countdownTime);

    const [timerState, setTimerState] = useState<"paused"|"running"|"expired">("paused");

    const intervalRef = useRef<NodeJS.Timeout|undefined>(undefined);

    const countdown = useEffectEvent(()=>{
        if (timeLeft <= 1){
            setTimerState("expired");
        }
        setTimeLeft(prev => prev-1);
    });

    // Just Updates; Doesn't stops the timer
    const update = (time:number)=>{
        setCountdownTime(clampSeconds(time));
    }

    const start = useCallback((time?: number)=>{
        // Resets Time Left
        setTimeLeft(time?clampSeconds(time):countdownTime);

        setTimerState("running");
    },[countdownTime]);

    const pause = useCallback(()=>{
        setTimerState("paused");
    },[]);

    const reset = useCallback(()=>{
        // Resets Time Left
        setTimeLeft(countdownTime);

        setTimerState("paused");
    },[countdownTime]);

    // Handle Intervals according to Timer-State
    useEffect(()=>{
        if (timerState==='running'){
            intervalRef.current = setInterval(countdown,1000);
        }else if(timerState==='paused'){
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }else{
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    },[timerState]);

    // Clears interval on UNMOUNT
    useEffect(()=>{
        return ()=> {
            clearInterval(intervalRef.current);
        }
    },[]);

    const timeFormat = useMemo(()=>{
        return {
            minutes: Math.floor(timeLeft/60),
            seconds: timeLeft%60
        }
    },[timeLeft]);

    // useEffect(()=>console.log(
    //     `${timeFormat.minutes}m ${timeFormat.seconds}s`
    // ),[timeFormat.seconds]);

    return {
        timeLeft, update, start, pause, reset, timerState, timeFormat
    }
}