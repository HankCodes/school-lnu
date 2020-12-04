# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for the assessment.

## Release status

_To make a release that will be assessed by the examiner you need to make sure all checkboxes below are checked. You check a checkbox by adding a "x" within the brackets._

- [x] I have started working on the assignment.
- [x] `npm install` is being used to install all dependencies.
- [x] `npm start` is being used to start the application.
- [x] All functional requirements are fulfilled.
- [x] All non-functional requirements are fulfilled.
- [x] I have completed the assignment report (see below).

---

- [x] I intend to submit the assignment and at the same time I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

_In the assignment report, you reflect on your assignment. You can write in English or Swedish._

### Reflection

_Your own thoughts on the assignment. What was hard, what have you learned? What could you have done differently?_

Detta var den roligaste uppgiften hittills. Innan denna uppgift har jag haft svårr att förstå hur server, databas, klient och url+path samspelar. Jag har fått en bredare förståelse hur en applikation kan byggas upp och hur serverkod kan hanteras. Jag känner att jag har blivit säkrare i min roll som programmerare efter denna uppgift.

Det svåraste var att få en förståelse om hur allt hänger ihop. Till en början förstod jag inte riktigt varför vissa saker fungerade på de sätt de gjorde. Till exempel skillanden på app.use() och app.set() och när dessa skulle användas. Men efter att ha jobbat med express ett tag började man känna igen mönster och det blev lättare att förstå vad man gjorde (det blev också lättare att läsa dokumentationen och få förståelse för vad man läst).

Hade jag programmerat denna app en gång till så hade jag i förväg arbetat fram en struktur för hur allt skall hanteras och byggas upp. Tex så skulle jag sett till att skripten som ligger hos klienten var mer genomtänkta än vad dom är i denna inlämning då jag inte har ordentlig koll på potentiela attackvektorer. Jag skulle också se till att i förväg bestämma vilka sidor som skall vara med och vilken funktionalitet förutom CRUD som appen skall innehålla. Problemet när man gör något helt nytt, tycker jag, är att man inte riktigt har någon kontroll på var projektet kan ta vägen. 

### Further improvments

_Further improvements of the assignment. What could you have done, but did not have the time to complete?_
HTTPS-anslutning skulle jag ha kunnat kolla upp men tiden räckte inte till. Efterson detta är något som kommer längre fram i kursen så finns det ändå tillfälle att lära sig det. 

Sökfunktionen på sidan är något som jag hafsade ihop i all hast och reflekterade inte så mycket över hur den kunde optimeras. I detta fall ville jag bara prova att göra det för att se om jag kunde, jag kollade således inte upp hur en sökfunktion skall/kan utföras på bästa sätt utan programmerade den bara utifrån den kunskapen jag har just nu.

Jag hade gärna sett att man kunde ändra lösenord och namn osv, alltså att settings-sidan skulle fungera i min app. 

Errorhanteringen för om servern inte hittar en user eller snippet är något jag funderar över. Om man skriver in ett eget ID i URL:ens path och id:t inte finns i databasen skulle man vilja visa ett visst meddelande, men uppstår det ett fel i databasen när man skall söka en befintlig snippet/user vill man ju ha en 500:ing...

### Extras

_Have you done anything more than the requirements?_
1. Jag har fixat docker och fått det att fungera.
2. Jag har lagt till en sökfunktion som söker på snippetnamn, användare och programmerings-språk.
3. Jag har ordnat stil för de olika språken så de får färg och indentering samt radnummer.
4. Snippets uppdateras med en "last modified" om de har blivit editerade efter att de skapats.
5. Jag har konfigurerat helmets content security policy så de accepterar resurser från utvalda källor.
6. Jag har gjort all stil och CSS själv, alltså inte använt bootstrap av något slag.

### Feedback

Jag kan inte riktigt komma på någon feedback. Jag tycker att uppgiften har varit tydlig. Jag tycker att man har fått lära sig alla väsentliga delar i kursmaterialet. Möjligen en kort genomgång om hur Express fungerar med sina middlewares. Jag minns att det tog en stund innan jag greppade vad en middleware var för något och hur next() ska/kan användas. Möjligen har detta förklarats på någon video men jag kan inte dra detta till minnes.
