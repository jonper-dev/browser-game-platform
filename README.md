# Browser game platform
## Horse Race
Hestespillet var en obligatorisk oppgave, og å splitte komponentene var noe vi måtte gjøre.
I mitt spill er det da en JavaScript-fil som holder rede på hvor hesten er, en annen som holder rede på banen
og sjekker med tilsendt informasjon når hesten (eller en hest) er over mållinjen.
Spillet har en nedtelling før løpet starter, og man kan pause og resette spillet både under denne og selve løpet.

Bonusfunksjonalitet er en «Mario Kart»-stil «gummistrikk»-effekt, der de som er lenger bak i feltet
har bedre odds for å gå langt per trykk, for å oppnå spenning med et jevnt felt.
I tillegg er det en slags midlertidig animasjon jeg har implementert bak hestene,
vind/støv virvler opp bak dem i kort tid etter tastetrykk. Hester som er i mål «danser» eller gynger litt når man trykker
på knappen etter å ha kommet i mål, som både er en litt artig responsivitet, og allikevel hindrer dem i å løpe ut av banen.
