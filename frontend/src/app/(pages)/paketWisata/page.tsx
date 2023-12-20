import { getServerSession } from 'next-auth/next';
import { options } from '../api/auth/[...nextauth]/options';

export default async function PaketWisata() {
    const session = await getServerSession(options)
    console.log(session,'session di paket wisata nih');
    
    return (
        <h1>Hello world</h1>
    )
}