
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace InventoryService.Helpers
{
    public class MailService
    {
        public  static void MailSender(string to,string mainUrl,string appealCode)
        {
            SmtpClient client = new SmtpClient("smtprelay.veyseloglu.az");

            //client.UseDefaultCredentials = false;
            //client.Credentials = new NetworkCredential("username", "password");

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("Stand.Management@veyseloglu.az");
            mailMessage.To.Add(to);
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = Body(mainUrl, appealCode);
            mailMessage.SubjectEncoding = Encoding.UTF8;
            mailMessage.Subject = "Testiq Merhelesi";
            mailMessage.BodyEncoding = Encoding.UTF8;
            client.Send(mailMessage);
            mailMessage.Dispose();

        }

        private static string Body(string mainUrl,string appealCode) {
            
            string body = "<table style='width: 100%; background-color: #45490e23;'> <tr> <td>" +
                    " <div style='clear: both; Margin-top: 10px; text-align: center; width: 100%;'>  " +
                    " <table style='width: 100%;'> <tr> <td  style='font-family: sans-serif; vertical-align:" +
                    " top; padding-bottom: 10px; padding-top: 10px; font-size: 16px; color: #05940c; text-align:" +
                    " center;font-weight:bold'> Təsdiq mərhələ sistemi   </td></tr> </table>  </div> " +
                    "  <div style='display: block; Margin: 0 auto; max-width: 580px; padding: 10px;'><table style='" +
                    " width: 100%; background: #ffffff; border-radius: 10px;'><tr><td style='font-family: sans-serif;" +
                    " font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;'><table> <tr>" +
                    " <td style='font-family: sans-serif; font-size: 14px; vertical-align: top;'>" +
                    " <p>Salam,</p> <p> Nömrəsi <strong>" + appealCode + "</strong> olan sifariş " +
                    "təsdiq olunması üçün sizə yönləndirilib.Zəhmət olmasa <a href='"+mainUrl+"' style='color:blue;'>buraya</a> klikləyin</p> " +
                    " </td></tr> </table></td></tr></table><div style='clear: both; Margin-top: 10px; text-align:" +
                    " center; width: 100%;'>      <table style='width: 100%;'>      <tr>  <td class='content-block" +
                    " powered-by' style='font-family: sans-serif; vertical-align: top; padding-bottom: 10px;" +
                    " padding-top: 10px; font-size: 12px; color: #999999; text-align: center;'> Veysəloğlu şirkətlər" +
                    " qrupu</td> </tr> </table></div> </div> </td> </tr></table>";

            return body;

        }



    }
}
