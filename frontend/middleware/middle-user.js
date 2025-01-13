export default async function({redirect}) {
    try {
        console.log("Here Middleware")
        const data = localStorage.getItem('userData')
        if( data.Position === "user"){
            console.log("userData is normal user!!");
            redirect('/')
        } else {
            console.log("userData is not user!!");
        }
    } catch (error) {
        console.log(error);
        redirect('/')
    }
}