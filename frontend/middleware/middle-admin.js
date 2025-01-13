export default async function({redirect}) {
    try {
        console.log("Here Middleware")
        const data = localStorage.getItem('userData')
        if( data.Position === "admin"){
            console.log("userData is Admin!!");
            redirect('/')
        } else {
            console.log("userData is not admin!!");
        }
    } catch (error) {
        console.log(error);
        redirect('/')
    }
}