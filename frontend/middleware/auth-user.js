export default async function({redirect}) {
    try {
        console.log("Here Middleware")
        if(localStorage.getItem('userData') !== null){
            console.log("userData is not null!!");
        } else {
            console.log("userData is null!!");
            redirect('/')
        }
    } catch (error) {
        console.log(error);
        redirect('/')
    }
}