package com.crawling.ssafy;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crawling.vo.MovieInfo;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {

   private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

   /**
    * Simply selects the home view to render by returning its name.
    */
   @RequestMapping(value = "/", method = RequestMethod.GET)
   public String home(Locale locale, Model model) {
      logger.info("Welcome home! The client locale is {}.", locale);

      Date date = new Date();
      DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);

      String formattedDate = dateFormat.format(date);

      model.addAttribute("serverTime", formattedDate );

      return "home";
   }

   //硫붽�諛뺤뒪
   @CrossOrigin
   @RequestMapping(value = "/megabox", method = RequestMethod.GET)
   public @ResponseBody MovieInfo megabox(){
      String result = "";
      Document doc = null;

      SimpleDateFormat format1 = new SimpleDateFormat ("yyyy-MM-dd");
      Date curTime = new Date();
      Calendar cal = Calendar.getInstance();
      cal.setTime(curTime);

      for(int i = 0; i < 7; i++){
         if(i != 0){
            cal.add(Calendar.DATE, 1);
         }

         String urlTime = format1.format(cal.getTime());
         result += urlTime;
         result += "*";
         String url = "https://movie.naver.com/movie/bi/ti/running.nhn?code=451&sdate=" + urlTime;

         try {
            doc = Jsoup.connect(url).get();
         } catch (IOException e) {
            e.printStackTrace();
         }

         
         Elements element = doc.select("tbody");

         String title = "";
         String time = "";
         
         Elements tr = element.select("tr");
         for(int j=0; j<tr.size(); ++j) {
            title = tr.get(j).select("th").select("a").text();
            result += title+"/";
            time = tr.get(j).select("td").text().replace(" | ", "|");
            result += time;
            if(j != tr.size()-1) {
               result += ",";
            }
         }
         
         if(title.equals("") && time.equals("")){
            result += "@";
         }
         if(i != 6) {            
            result += "&";
         }
      }
      System.out.println("mega   "+result);
      MovieInfo vo = new MovieInfo(result);
      return vo;
   }

   //濡��뜲�떆�꽕留�
   @CrossOrigin
   @RequestMapping(value = "/lottecinema", method = RequestMethod.GET)
   public @ResponseBody MovieInfo lottecinema(){
      String result = "";
      Document doc = null;

      SimpleDateFormat format1 = new SimpleDateFormat ("yyyy-MM-dd");
      Date curTime = new Date();
      Calendar cal = Calendar.getInstance();
      cal.setTime(curTime);

      for(int i = 0; i < 7; i++){
         if(i != 0){
            cal.add(Calendar.DATE, 1);
         }

         String urlTime = format1.format(cal.getTime());
         result += urlTime;
         result += "*";
         String url = "https://movie.naver.com/movie/bi/ti/running.nhn?code=167&sdate=" + urlTime;

         try {
            doc = Jsoup.connect(url).get();
         } catch (IOException e) {
            e.printStackTrace();
         }

         
         Elements element = doc.select("tbody");

         String title = "";
         String time = "";
         
         Elements tr = element.select("tr");
         for(int j=0; j<tr.size(); ++j) {
            title = tr.get(j).select("th").select("a").text();
            result += title+"/";
            time = tr.get(j).select("td").text().replace(" | ", "|");
            result += time;
            if(j != tr.size()-1) {
               result += ",";
            }
         }
         if(title.equals("") && time.equals("")){
            result += "@";
         }
         if(i != 6) {            
            result += "&&";
         }
      }
      System.out.println("lotte   "+result);
      MovieInfo vo = new MovieInfo(result);
      return vo;
   }

   @CrossOrigin
   @RequestMapping(value = "/cgv", method = RequestMethod.GET)
   public @ResponseBody MovieInfo cgv(){
      String result = "";
      Document doc = null;

      StringBuffer sb;

      SimpleDateFormat format1 = new SimpleDateFormat ("yyyyMMdd");
      Date curTime = new Date();
      Calendar cal = Calendar.getInstance();
      cal.setTime(curTime);
      for(int i = 0; i < 7; i++){
         if(i != 0){
            cal.add(Calendar.DATE, 1);
         }
         String urlTime = format1.format(cal.getTime());
         String url = "http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx?areacode=204&theatercode=0053&date=" + urlTime;
         sb = new StringBuffer(urlTime);
         sb.insert(4,"-");
         sb.insert(7,"-");
         result += sb;
         result += "*";
         
         try {
            doc = Jsoup.connect(url).get();
         } catch (IOException e) {
            e.printStackTrace();
         }
         
         Elements element = doc.select("div.sect-showtimes").select("ul");
         String title = "";
         String time = "";
         String[] temp = null;
         
         Elements col = element.select(".col-times");
         for(int k=0; k<col.size(); ++k) {
            title = col.get(k).select(".info-movie").select("a").select("strong").text();
            result += title+"/";
            time = col.get(k).select("li").select("em").text();
            temp = time.split(" ");
             Arrays.sort(temp);
             for(int j=0; j<temp.length; ++j){
                result += temp[j];
                if(j != temp.length -1){
                   result += "|";
                }
             }
            if(k != col.size()-1) {
               result += ",";
            }
         }
         if(title.equals("") && time.equals("")){
            result += "@";
         }
         if(i != 6) {            
            result += "&";
         }
      }
      System.out.println("cgv    "+result);
      MovieInfo vo = new MovieInfo(result);
      return vo;
   }

}