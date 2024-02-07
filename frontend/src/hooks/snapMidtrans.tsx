import { useEffect, useState } from "react"

declare global {
    interface Window {
        snap: any; // Adjust the type according to your usage
    }
}

const useSnap = () => {
    const [snap, setSnap] = useState<any>(null)

    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'; 
        const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY
        const script = document.createElement('script')
        script.src = midtransScriptUrl
        if (myMidtransClientKey) script.setAttribute('data-client-key', myMidtransClientKey);

        script.onload = () => {
            setSnap(window.snap)
        }
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const snapEmbed = (snap_token:string, embedId:string, 
        action: {
        onSuccess: (result: any) => void,
        onPending: (result: any) => void,
        onClose: () => void
    }) => {
        if (snap) {
            snap.embed(snap_token, {
                embedId,
                onSuccess: function (result: any) {
                    console.log('success', result);
                    action.onSuccess(result)
                },
                onPending: function (result: any) {
                    console.log('pending', result);
                    action.onPending(result)
                },
                onClose: function () {
                    action.onClose()
                    
                }
            })
        }
    }

    return { snapEmbed }
}

export default useSnap;