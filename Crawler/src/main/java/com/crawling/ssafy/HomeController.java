package com.crawling.ssafy;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
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
   

   @CrossOrigin
   @RequestMapping(value = "/megabox", method = RequestMethod.GET)
   public @ResponseBody MovieInfo doc(){
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

         // 주요 뉴스로 나오는 태그를 찾아서 가져오도록 한다.
         Elements element = doc.select("tbody");

         String title = "";
         String time = "";
         for(Element el : element.select("tr")) {    // 하위 뉴스 기사들을 for문 돌면서 출력
            title = el.select("th").select("a").text();
            result += title;
            result += "/";
            time = el.select("td").text().replace(" | ", "|");
            result += time;
            result += ",";
         }
         if(title.equals("") && time.equals("")){
        	result += "@";
         }
         result += "&";
      }
      System.out.println(result);
      MovieInfo vo = new MovieInfo(result);
      return vo;
   }

}