
var aws  = require('aws-sdk');

var config = require('config');

var ses = new aws.SES({
       accessKeyId: config.ACCESSKEYID,
       secretAccessKey: config.SECRETACCESSKEY,
       region: config.REGION
});

module.exports={

    welcomeMail: async(sendToEmail, token) => {
        return new Promise((resolve,reject) =>{
            if(token){
                var subject = 'Welcome mail from Ether8ball';
                var mailBody = `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Dear User, </p> \
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                Congratulations ! <br> You are successfully registered on our portal.<br><br>
                                <br>
                                Please verify your account to login on our portal<br>
                                Please click on this http://localhost:5000/verifyEmail?token=`+token+` link to verify your account. <br>
                                Note: Do not share your login details with anyone.

                                <br>            
                            </p>`;
            } else {
                var subject = 'Email verified successfully Ether8ball';
                var mailBody = `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Dear User, </p> \
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                Congratulations ! <br> Your account is verified now. <br><br>
                                <br>
                                You can login with your login details.
                                Note: Do not share your login details with anyone.
                                <br>            
                            </p>`;
            }
            
            var ses_mail = "From: ether8ball <" + config.SENDEREMAIL + ">\n";

                ses_mail = ses_mail + "To: " + sendToEmail + "\n";
                ses_mail = ses_mail + "Subject: " + subject + "\n";
                ses_mail = ses_mail + "MIME-Version: 1.0\n";
                ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                ses_mail = ses_mail + compileMail(mailBody) + "\n\n";
                ses_mail = ses_mail + "--NextPart--";
                
            var params = {
                    RawMessage: { Data: new Buffer(ses_mail) },
                    Destinations: [ sendToEmail ],

                    Source: "ether8ball <" + config.SENDEREMAIL + ">",
                };
                
            ses.sendRawEmail(params, function(err, data) {
                if(err) {
                    console.log(err);
                    return reject('Sorry failed to send welcome email');
                }
                else {
                    return resolve('Welcome mail has been sent successfully');
                }          
            });
        });
    },
                    
    resendOTP: async(sendToEmail, emailOTP) => {
        return new Promise((resolve,reject) =>{            
            var subject = 'Email Confirmation for Ether8ball';
            var mailBody = `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Dear User,</p> \
        
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                Your verification code is : ` + emailOTP + `
                                <br>
                                Please do not share this code with anyone.
                            </p>`;
            
            var ses_mail = "From: ether8ball <" + config.SENDEREMAIL + ">\n";

                ses_mail = ses_mail + "To: " + sendToEmail + "\n";
                ses_mail = ses_mail + "Subject: " + subject + "\n";
                ses_mail = ses_mail + "MIME-Version: 1.0\n";
                ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                ses_mail = ses_mail + compileMail(mailBody) + "\n\n";
                ses_mail = ses_mail + "--NextPart--";
                
            var params = {
                    RawMessage: { Data: new Buffer(ses_mail) },
                    Destinations: [ sendToEmail ],

                    Source: "ether8ball <" + config.SENDEREMAIL + ">",
                };
                
            ses.sendRawEmail(params, function(err, data) {
                if(err) {
                    console.log(err);
                    return reject('Sorry failed to send email');
                }
                else {
                    return resolve('mail has been sent successfully');
                }          
            });
        });
    },

    forgotPasswordLink: async(sendToEmail, userName, token) => {
        return new Promise((resolve,reject) =>{

            var subject = 'Forgot Password Link from ether8ball';
            var mailBody = `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Hello `+ userName +`, </p> \
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                We have initiated forgot password request as per your instructions.<br><br>
                                Password Reset Link: https://xyz.com/#/forgotPassword?token=`+ token + `
                                <br>
                                Forgot Password Link will be valid for 10 mins.   
                                <br>
                            Please do not share this link with anyone. <br>
                            
                            </p>`;
            var ses_mail = "From: ether8ball <" + config.SENDEREMAIL + ">\n";

                ses_mail = ses_mail + "To: " + sendToEmail + "\n";
                ses_mail = ses_mail + "Subject: " + subject + "\n";
                ses_mail = ses_mail + "MIME-Version: 1.0\n";
                ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                ses_mail = ses_mail + compileMail(mailBody) + "\n\n";
                ses_mail = ses_mail + "--NextPart--";
                
            var params = {
                    RawMessage: { Data: new Buffer(ses_mail) },
                    Destinations: [ sendToEmail ],

                    Source: "ether8ball <" + config.SENDEREMAIL + ">",
                };
                
            ses.sendRawEmail(params, function(err, data) {
                if(err) {
                    return reject('Sorry failed to send forgotPassword Link email');
                }
                else {
                    return resolve('Forgot password link has been sent to your email id with more details');
                }          
            });
        });
    },

    confirmationMailForpasswordReset: async(sendToEmail) => {
        return new Promise((resolve,reject) =>{

            var subject = 'Password has been successfully Reset';
            var mailBody =  `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Hello user, </p> \
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                Your Password has been successfully changed.<br><br>
                                You can login now with your new Password.
                            </p>`;
                
            var ses_mail = "From: ether8ball <" + config.SENDEREMAIL + ">\n";

            ses_mail = ses_mail + "To: " + sendToEmail + "\n";
            ses_mail = ses_mail + "Subject: " + subject + "\n";
            ses_mail = ses_mail + "MIME-Version: 1.0\n";
            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
            ses_mail = ses_mail + "--NextPart\n";
            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
            ses_mail = ses_mail + compileMail(mailBody) + "\n\n";
            ses_mail = ses_mail + "--NextPart--";
            
            var params = {
                RawMessage: { Data: new Buffer(ses_mail) },
                Destinations: [ sendToEmail ],

                Source: "ether8ball <" + config.SENDEREMAIL + ">",
            };
            ses.sendRawEmail(params, function(err, data) {
                    if(err) {
                        return reject('Sorry failed to send email');
                    }
                    else {
                        return resolve("mail has been sent for  password updation confirmation");
                    }          
            });
        });
    },

    OtpMail: async(sendToEmail,otp) => {
        return new Promise((resolve,reject) =>{

            var subject = 'Your requested One Time Password';
            var mailBody =  `<p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Hello user, </p> \
                            <p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'> \
                                Your requested One Time Password is:`+ otp +`<br><br>
                                Otp will be valid for 10 minutes.
                                Please don't share this otp with anyone.
                            </p>`;
                
            var ses_mail = "From: ether8ball <" + config.SENDEREMAIL + ">\n";

            ses_mail = ses_mail + "To: " + sendToEmail + "\n";
            ses_mail = ses_mail + "Subject: " + subject + "\n";
            ses_mail = ses_mail + "MIME-Version: 1.0\n";
            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
            ses_mail = ses_mail + "--NextPart\n";
            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
            ses_mail = ses_mail + compileMail(mailBody) + "\n\n";
            ses_mail = ses_mail + "--NextPart--";
            
            var params = {
                RawMessage: { Data: new Buffer(ses_mail) },
                Destinations: [ sendToEmail ],

                Source: "ether8ball <" + config.SENDEREMAIL + ">",
            };
            ses.sendRawEmail(params, function(err, data) {
                    if(err) {
                        return reject('Sorry failed to send email');
                    }
                    else {
                        return resolve("mail has been sent for  password updation confirmation");
                    }          
            });
        });
    },
}


function compileMail(section1 = '', section2 = ''){
    var mailText = "<html> <body> <div style='font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;margin:0;padding:0'><table width='100%' cellpadding='0' cellspacing='0'><tbody> <tr> <td style='vertical-align:top'></td></tr></tbody></table><table width='100%' cellpadding='0' cellspacing='0'><tbody> <tr> <td bgcolor='#8fc1c2' style='vertical-align:top;border-top:3px solid #8cc1c1;background-position:center;background-repeat:no-repeat;padding-top:0px;padding-bottom:0px'><table width='600' align='center' cellspacing='0' cellpadding='0'><tbody> <tr> <td style='vertical-align:middle'><h1 style='font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;color:#ffffff;font-weight:300;text-align:center;font-size:42px;line-height:48px;margin:0'>Ether8ball</h1> </td></tr></tbody></table> </td></tr></tbody></table><table width='100%' cellpadding='0' cellspacing='0' style='padding-top:20px;padding-bottom:20px'><tbody> <tr> <td style='vertical-align:top'><table width='600' cellspacing='0' cellpadding='0' align='center'><tbody> <tr> <td style='vertical-align:top'>section1 </td></tr></tbody><tfoot> <tr> <td style='vertical-align:top'><table width='100%' cellspacing='0' cellpadding='0'><tbody> <tr> <td style='vertical-align:top'><hr style='vertical-align:top;border-bottom:1px solid #dddddd;border-left:none;border-top:none;border-right:none;padding-bottom:0px;padding-top:20px;margin:0'> </td></tr></tbody></table> </td></tr></tfoot></table> </td></tr></tbody></table>section2<table width='100%' cellpadding='0' cellspacing='0' style='padding-bottom:20px'><tbody> <tr> <td style='vertical-align:top'><table width='600' align='center' cellspacing='0' cellpadding='0'><tbody> <tr> <td style='vertical-align:top'><p style='color:#666666;font-size:16px;font-weight:300;margin-top:0;margin-left:0;margin-right:0;margin-bottom:25px;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:26px'>Sincerely,<br>Team ether8ball</p></td></tr></tbody><tfoot> <tr> <td style='vertical-align:top'><table width='100%' cellspacing='0' cellpadding='0'><tbody> <tr> <td style='vertical-align:top'><hr style='vertical-align:top;border-bottom:none;border-left:none;border-top:none;border-right:none;padding-bottom:0px;padding-top:20px;margin:0;padding:0'> </td></tr></tbody></table> </td></tr></tfoot></table> </td></tr></tbody></table><table width='100%' cellpadding='0' cellspacing='0' style='background-color:#eeeeee;padding-top:15px;padding-right:15px;padding-bottom:25px;padding-left:15px'><tbody> <tr> <td style='vertical-align:top'><table width='600' align='center'><tbody> <tr> <td style='vertical-align:top'><h4 style='font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;color:#333333;font-weight:300;text-align:center;font-size:18px;line-height:24px'>Need help? We're always here for you.</h4> </td></tr><tr> <td style='vertical-align:top;background-color:#de3723;padding-top:10px;padding-right:15px;padding-bottom:10px;padding-left:15px;text-align:center'><a href='http://xyz.com' style='color:#ffffff;font-size:18px;text-decoration:none;font-family:\"Helvetica Neue\",\"Helvetica\",Helvetica,Arial,sans-serif;line-height:35px;font-weight:normal' target='_blank'>Contact Us</a></td></tr></tbody></table> </td></tr></tbody></table> </div></div><span class='HOEnZb adL'><font color='#888888'></font></span></div></body></html>";     
    mailText = mailText.replace('section1', section1);
    mailText = mailText.replace('section2', section2);
    return mailText;
}
