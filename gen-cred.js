const nodemailer=require('nodemailer');
async function main(){
    let ta=await nodemailer.createTestAccount();

    console.log("User: "+ta.user);
    console.log("Pass: "+ta.pass);
}
main().catch(console.error);