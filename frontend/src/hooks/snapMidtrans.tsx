import { useEffect, useState } from "react"

declare global {
    interface Window {
        snap: any; // Adjust the type according to your usage
    }
}

const snapMidtrans = () => {
    const [snap, setSnap] = useState<any>(null)

    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'; 
        const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
        const script = document.createElement('script')
        script.src = midtransScriptUrl
        if (myMidtransClientKey) script.setAttribute('data-client-key', myMidtransClientKey);

        // script.onload = () => {
        //     setSnap(window.snap)
        // }
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const snapEmbed = (snap_token:string, embedId:string, 
        action:any ) => {
        if (snap) {
            snap.embed(snap_token, {
                embedId,
                onSuccess: function (result: any) {
                    console.log('success', result);
                    // action.onSuccess(result)
                },
                onPending: function (result: any) {
                    console.log('pending', result);
                    // action.onPending(result)
                },
                onError: function(result: any){console.log('error');console.log(result);},
                onClose: function () {
                    console.log('close');
                }
            })
        }
    }

    return { snapEmbed }
}

export default snapMidtrans;