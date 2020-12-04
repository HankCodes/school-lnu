# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for the assessment.

## Release status

_To make a release that will be assessed by the examiner you need to make sure all checkboxes below are checked. You check a checkbox by adding a "x" within the brackets._

- [x] I have started working on the assignment.
- [x] `npm install` is being used to install all dependencies.
- [x] `npm start` is being used to start the application.
- [x] All functional requirements are fulfilled.
- [x] All Production requirements are fulfilled.
- [x] All non-functional requirements are fulfilled.
- [ ] I have completed the assignment report (see below).

---

- [x] I intend to submit the assignment and at the same time I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

_In the assignment report, you reflect on your assignment. You can write in English or Swedish. Remove this and all following hints before you hand in._

### URL to your application


https://cscloud474.lnu.se

### Security

_Describe what you have done to make your application secure, both in code and when configuring your application server._

Jag har använt mig av CertBot för att generera TLS-certifikat, detta är installerat på produktions-servern. Detta ger trafik över HTTPS mellan klient och reversed proxy. Mellan reversed proxy och applikations-servern är det http.

Applikationen använder sig av Helmet som sätter en del HTTP response headers för att göra applikationen säkrare, tex tar den bort 'x-powered-by'-headern för att inte avslöja att applikationen drivs av Express och mer därtill. En CSP konfiguration är gjord för att se till att applikationen enbart accepterar resurser från sidor jag själv har godkänt. Detta är ett extra lager utöver det som ingår per default i Helmet och gör att XXS-attacker blir svårare att utföra.

Hbs vymotor sköter mycket av escapeingen när man renderar användar-input/API-input och skyddar således mot att skadlig kod renderas på sidan. Viktigt är då att man använder två stycken curly-brackets för att tala om hbs att det skall renderas som en text-sträng. Exempel: {{data}}.

För cookies har jag satt sameSite till 'lax' för att minimera risken för CSRF-attacker. Vad detta gör är att webbläsaren inte kommer att skicka med cookies om en POST-request görs från en annan site än min egna. Man kan således inte skicka en POST-request som skapats på en annan webbplats och skicka den till min applikations-server.

Jag har även satt httpOnly till true för att se till att cookies inte går att läsas av script. Med denna inställning går cookiedatan enbart att läsas via http-requests.

För att tillåta en användare att göra requests som att hämta/skicka data via gitlabs API har jag ett inlogg antigen via Oauth2 eller att skapa ett konto på min applikation och logga in med dessa uppgifter. Vad jag gör sedan är att kolla så att session-cookien innehåller information om att användaren är inloggad för att kunna göra requests. Detta görs via en controller. Jag gör också skillnad på anrop om de görs via ett applikations-inlogg eller Oauth2. 

När man loggar in med ett applikationskonto gör man alla API-anrop till GitLab via ett access token. Detta finns sparat som en environment-variabel och skickas med vid varje API-anrop.

När man väljer att autentisera sig via Oauth2 skickar jag med en state-variabel i url:en till gitlabs inlogg. Denna state-variabel har jag sparat som en environment-variabel. När användaren har autentiserat sig och blir redirectad till den callback-url jag angivit jämför jag state-variabelrna med varandra för att se att de stämmer. Skall man göra detta ordentligt skall man generera en ny variabel för varje Oauth2 inlogg men kände att jag inte hade tiden till att sätta mig in i hur det fungerade utan nöjde mig med att göra en simplare jämförelse. Enligt GitLab's dokumentation är det inte ett tvång att använda en state-variabel men de rekomenderar att man har det och de verkar själva tycka att det skulle vara något som skulle tillhöra standard att ha med.

För att autentisera webhooken har jag har sparat en hashad och saltad version av min webhook-token som en environment-variabel. När gitlab gör en request mot min server kollar jag, via min authorization controller, att 'x-gitlab-token'-headern håller samma token som jag har sparat i min environment-variabel. Denna jämförelse görs via bcrypt. Bcrypt.compare() ser till att det blir en sk 'time-constant' jämförelse mellan dessa tokens vilket kommer att försvåra en brute-force-attack för att lista ut vilket token som används.

Jag satte även scriptet till websocketen på klienten på sidor som kräver inlogg för att minimera risken att bli utsatt för attacker via websocketen. Dvs, man kopplar bara upp sig på websocketen om man är inloggad. Detta är inget fullt skydd men en bit på vägen. Vidare bör man ta till åtgärder för hur mycket data som skall kunna skcikas över websockets från klienten för att undvika DDOS attacker.

### Description of entities

_ Describe the following parts, how you are using them, and what their purpose is in your solution:

- Reversed proxy    
En reversed proxy kan ha många användningsområden. En proxy i sig är ofta till för att dölja vem den anropande klienten är. Ofta skickar man request från sin egna klient till en reversed proxy som sedan får dirigera trafiken vidare dit man vill. Detta gör att ens egan klient håller sig dold för servern man anropar resurser ifrån. På samma sätt kan vi använda en reversed proxy för att dölja våran applikations-server eller andra servrar om vi har fler. 

I denna uppgift har vår reversed proxy i uppgift att ta emot anrop via https för att sedan dirigera trafiken vidare över http till vår applikations-server. Detta gör vi för att vår reversed proxy har möjlighet att solla ut en del angrepp som vi kan ha mot servrar som ligger uppkopplade mot internet. Angripare får heller inte tillgång till information från vår applikations-server lika lätt med en reversed proxy. Den har också möjlighet att spara loggar och monitorera trafiken över servern. 

En reversed proxy kan dock ha fler användningsområden än så. Bland annat kan man använda den som en lastbalanserare som kan dirigera trafik till flera olika servrar om belastningen är hård. Fördelen med detta är att man kan ha flera applikations-servrar och avlasta trafik på dessa för att slippa ta all trafik på en enda applikations-server.

En reversed proxy kan även casha statiska filer samt filer som ofta efterfrågas av de inkommande klienterna för att snabba på responsen till klienterna. 

Man kan också sammankoppla olika applikationer under samma url. På så sätt kan man som utvecklare ge användarna tillgång till applikationer som existerar separat, på separata servrar under samma url för en bättre upplevelse.

- Process manager  
En process manager är ett verktyg vi som utvecklare har för att kunna automatisera och monitorera över processer som drivs på vår server. Förutom att en process manager kan ge en överblick över vår servers "hälsa" kan den också hjälpa oss med olika kommandon så som att autorestarta om servern skulle krascha. Den kan spara error-loggar och se till att din applikation hålls uppkopplad! Du har även möjlighet att på ett enkelt sätt välja hur din server skall bete sig och köras. Tillexempel finns det inställningar på hur servern skall bete sig vid eventuell restart, du kan starta servern med en lastbalanserare osv.

- TLS certificates  
TLS är ett sätt att enkryptera den data som skickas mellan enheter, tex mellan server och klient. TLS (och SSL, som enligt vissa källor är mycket samre än TLS och enligt andra källor gör i princip samma jobb...) är det som sätter S:et i HTTPS. HTTP-protokollet är fortfarande detsamma men TLS krypterar datat som överförs. Hanteringen av HTTPS sker via symmetrisk och assymetrisk kryption vilket går ut på att servern håller en hemlig privat avkrypteringsnyckel som enbart kan användas för att avkryptera meddelanden samt skickar en public key till klienterna som används för att kryptera trafik.  
Så här går en koppling via HTTPS (HTTP med ett lager av TLS) till: 
1. Klienten gör en förfrågan till servern.
2. Servern svarar med ett certifikat som bevisar (om det är ett riktigt/bra certifikat vill säga) att det är en säker kryptering. Det ingår också information om servern, vem som tillhandahåller den samt vem som utfärdat certifikatet. servern skickar även med en public key för enkryptering.
3. Klienten får responsen och kan nu kolla över en lista på kända verifierade certifikat för att avgöra om detta certifikat är att lita på. Klienten kollar även om utgivaren finns med på listan av egna tillåtna certifikat. (Servern kan komma att efterfråga certifiering från klienten för att verifiera denna men det är mer i situationer som kräver hög säkerhet). Om klienten tycker att allt ser okej ut kommer klienten att skapa en egen krypteringsnyckel och skicka med i responsen tillbaka till servern. Meddelandet som skickas kommer att krypteras med den public-key som klienten fått av servern.
4. Server och klient kommer nu att kommunicera med krypterad data som krypteras och dekrypteras av den nyckel som klienten har skapat och skickat till servern.

- Environment variables  
Att använda environment-variabler är ett sätt att sätta globala variabler som kan användas av hela servern. Dessa är ej åtkomliga för klienten. det är variabler som deklareras utanför själva systemet (tex servern vi programmerar) och är således möjliga att få tag på i system som ligger innanför scopet för environment-variabeln. Dessa variabler sätts av inbyggd funktionalitet i operativsystemet.

I denna applikation används environment-variabler för att spara acess-tokens, urler som används över applikationen samt annan viktig data som på ett eller annat sätt bör antingen hållas hemlig eller vara enkelt tillgänlig. En enorm fördel med att sätta en environment-variabel är att man kan spara ett värde och använda environment-referensen till det värdet över sin applikation. Skulle värdet behövas bytas ut gör man det i sin .env-fil och kommer således att ändras på alla ställen det värdet refereras till. 
_

### Development vs. Production

_What differs in your application when running it in development from running it in production?_

Det är inte mycket som skiljer koden i min applikation mellan development och production mode mer än att applikationen optimeras när man sätter den i production-mode. Detta görs bland annat genom att casha vissa filer och skala ned error meddelanden. 

I min kod skickas inte error meddelanden för 500-fel till klienten utan dessa byts ut mot 404. detta gör jag för att inte avslöja för klienten att det är ett serverfel utifall att en angripare kan nyttjas av sådan information.

Versionen som körs på servern (till skillnad från den version som körs lokalt på datorn) har inte nodemon och eslint installerat då dessa enbart är till för utvecklingsmiljön.

Applikationen som körs på den publika servern omsluts också av en process manager som ser till att applikationen hålls uppe och gör det möjligt att monitorera applikationen.

### Use of external dependencies

_Which extra modules did you use in the assignment? Motivate the use of them and how you have to make sure that they are secure enough for production._

För att behålla säkerhet i applikationen är det viktigt att de dependecies man laddar ned är säkra. Det jag har gjort för att minimera risken för att använda sårbara dependencies är att använda de mest populära modulerna. 
Man får söka på webben och se vilka moduler som verkar mest populära, sedan får man kolla hur många nedladdningar dessa har samt om de uppdateras regelbundet.
Detta är ingen garanti för att dessa inte kan innehålla säkerhetshål men populära moduler med regelbunden uppdateringsfekvens kan ändå anses som säkra. Man kan förvisso kolla igenom alla issues eller försöka hitta annan information om det finns några kända risker med den modul man vill använda sig av.   
Ett extra skydd är också att köra 'npm audit' i sin konsoll för att låta npm's inbyggda "scanner" söka igenom de moduler man har.  

Här följer en lista över de moduler jag använt:  


Då detta är en express-server så använder jag Express, Express-session för cookies och Express-hbs som vymotor.

Dotenv används för att hantera environment-variabler.

Bcrypt används för att hasha och salta samt jämföra känslig data så som lösenord och olika tokens.

Helmet används för att ge ett extra lager av säkerhet för applikationen genom att sätta olika response-headers samt konfiguera CSP.

Http-errors används för att skapa olika http-relaterade error meddelanden.

Moment är en modul för att lättare formattera datum.

Mongoose är en modul som förenklar kommunikationen med den mongoDB-databas jag satt upp för användarkonton.

Morgan används för att få en överblick över trafiken till och från servern. Den ger information om vilka resurser som efterfrågas samt vilken statuskod som skickas.

Node-fetch används för att fetcha data till servern. Till exempel används Node-fetch för att hämta data från GitLabs API.

Socket.io är en modul för att hantera websocketen på applikationen.

Nodemon används som en dev-dependency och används bara under development. Den ser till att starta om servern efter varje föränding så man slipper göra detta manuellt.

Eslint med lnu config används för att se till att koden följer den kodstandard som kursen kräver.

### Overall Reflection

_Your own thoughts on the assignment. What was hard, what have you learned? What could you have done differently?_

Det svåraste var att få en förståelse för hur GitLabs API fungerade samt vad Oauth var för något. När jag planerade uppgiften var det svårt att göra en bedömning över vad som var rimligt att ha med och vad applikationen skulle innehålla.

Det jag gjorde var att skriva ned allt jag skulle vilja ha med sedan fick jag börja programmera applikationen utefter det. En bit in i projektet kände jag att jag hade en bra koll på hur allt hände ihop. Då hade jag förvisso valt att gå vissa vägar i implementationen som sedan krockade lite med att lägga till övrig funktionalitet (tex går det ej att deleta en kommentar trots att det finns stöd för det i koden på servern). 

Att implementera Oauth var i sig inte så komplicerat när man väl förstod vad man behövde göra. Dock så uppstod en del frågetecken om hur denna information skulle hanteras för att hållas säker. Just för denna uppgift används session-storage för att lagra cookies för servern även om detta inte är för production-mode men i ett riktigt scenario hade man behövt spara i någon databas eller liknande. Vi har även en state-query i redirect url:en till gitlab vid inlogg som bör vara unikt vid varje inlogg osv.

Ngrok var något nytt i denna uppgift som var ett bra verktyg för att kunna nå sin applikation annat än från den lokala maskinen. Spännande!

Att sätta upp https via certbot var inte så komplicerat som man skulle kunna tro heller. Dock kan jag tänka mig att det blir ett annat förfarande om man skulle köpa sig en licens.

Att sätta upp en produktionsserver var också väldigt spännande och lärorikt. Både att man man får bli mer bekväm med att navigera med konsollen men också hur det kan se ut när en applikation ligger uppe. Man har fått använda en process manager för att hantera servern vilket har varit ett bra verktyg. Jag har fått en mycket bättre förståelse för hur alla delar hänger ihop med varandra och på vilket sätt en produktionssituation kan se ut.

Även att pusha till repon till olika plater har vi fått lära oss och hur ett arbetsflöde bli när vissa saker pushas till versionshanteringssystem vs. produktion.

Något jag också fått upp ögonen för är hur viktigt det är med en development miljö och en produktionsmiljö. 
---
Det jag tänker på är till exempel att databaser bör separeas mellan produktion och development. Även GitLab appar för Oauth borde separeras, webhooks likaså.

Detta skulle jag ha tänkt på mycket tidigare än jag gjorde känner jag. Det var mycket meck med att byta alla ngrok url:er på Gitlab och i koden samt byta tillbaka dem om man ville kolla hur det fungerade i produktion. Jag kom på allt för sent att separera detta. Mycket onödig tid gick åt till att ändra url:er (och missa att ändra... suck)

### Further improvments

_Further improvements of the assignment. What could you have done, but did not have the time to complete?_

Jag hade velat löst state-queryn i oauth login urlen så den blev unik för varje redirect dit.

Jag hade velat fixa en annan storage för cookies som mer var lämpad för produktion.

Jag hade velat fixa så att man kunde öppna och stänga issues samt deleta kommentarer så applikatonen blev mer användbar. Men jag kände att jag hade lärt mig hur API:et fungerade och ville inte lägga ned mer tid på den typen av funktionalitet. Sen vet jag inte heller om jag vill att man skall komma åt mina repon och issues med de befogenheterna.... Dock hade jag nog haft så man bara kan autentisera sig via oauth om det var så.

Helst av allt hade jag velat ha applikationen som en SPA och göra den mesta av trafiken via websocketen men jag kände att det blev för meckigt att rendera på klienten med vanilla javascript för att det skulle vara värt i denna uppgift. Fanns mer jag ville lära mig och lägga tid på.

Jag hade en idé om att göra en serviceworker som med background sync kan hämta alla issues och komemntarer i bakgrunden och spara dem i local storage så att sidan kan användas offline. Detta skulle bygga på att klienten renderar sidorna. Man skulle kunna ha en popupruta som genereras som säger "the application now works offline" eller liknande. Och kanske en notis om att man är offline om man skulle hamna offline. 

Det finns också tekniker för att spara forms som skickas offline för att sedan skicka dem när man bli online igen, det hade varit kul att implementera så att om mna skulle vilja använda appen offline, eller att man skriver en komemntar och råkar hamna offline sparas det innehållet för att sedan skickas när man väl har uppkoppling igen. Men det är ju utanför scopret av denna uppgift.

### Extras

_Have you done anything more than the requirements?_

1. All layout och CSS är gjort helt själv. Jag har alltså inte använt några bibliotek eller liknande. Allt är gjort från grunden by hand.

2. Jag har implementerat Oauth2 som inloggningsalternativ.
3. Jag har ett vanligt inlogg om man inte skulle vilja logga in med oauth.
4. Applikationen känner av om man är Oauth2 autentiserad och fetchar då efter den användarens uppgifter men går över till Acess-token och fetchar mitt innehåll om man loggar in som vanligt. Detta gjorde jag utifall att jag inte fick oauth att fungera så finns en backup-plan.
5. Jag använde certbot ist för egensignat TLS-certifikat.
6. Man kan se alla repos på användaren
7. Man kan se alla issues på alla repos
8. Man kan se alla kommentarer. Man kan se om kommentarer är svar på andra kommentarer (de läggs ihop i samma "container").
9. Man kan svara på kommentarer samt skriva egna kommentarer.
10. Jag utökade restart funktionen på pm2 så den inte hets-restartar om appen skulle krasha utan för varje restart så lägger den på 100ms innan den provar igen för att inte överbelasta systemet i onödan.



### Feedback

_Feedback to the course management about the assignment._

Jag tycker att detta är en väldigt bra uppgift då den går igenom hur man produktionssätter och HTTPS som är viktigt att lära sig. Det är också kul att man får möjlighet att använda sig av modernare tekniker så som websockets och få erfarenheter utav det. Det är också bra att vi gör detta mot GitLab så man får en bättre bild över hur det fungerar.

Jag tycker att det är en bra nivå på uppgiften eftersom att det är så mycket nytt man skall prova på. Sen är det bra att det finns möjlighet att höja betyget genom extra funktionalitet om man vill.
