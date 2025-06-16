/**
 * 🏥 SISTEMA DE GESTIÓN ZONA 1561 - 182 FARMACIAS
 * Datos específicos para tabla simple
 * @version: 4.0.0
 * @records: 182 farmacias exactas
 */

// 🎯 Configuración global
const CONFIG = {
    STORAGE_KEY: 'zona1561_182registros',
    VERSION: '4.0.0',
    AUTO_SAVE_INTERVAL: 30000
};

// 💾 Clase principal optimizada
class FarmaciaManager {
    constructor() {
        this.farmacias = [];
        this.editingIndex = -1;
        this.currentFilter = '';
        
        // 📊 Datos exactos de los 182 registros
        this.initialData = [
            { nombre: "Doralba Gomez pedidos (supervida)", telefono: "3112629258", observaciones: "pedidos con la Sra Doralba en horas AM" },
            { nombre: "Paola (galeno)", telefono: "3005503883", observaciones: "pedidos con Paola" },
            { nombre: "Maria Castellanos(farmavida)", telefono: "3044919278", observaciones: "pide por drosan (tiene vencida estermax tab) Fabio" },
            { nombre: "Antonio (nuevo sol)", telefono: "3178180817", observaciones: "pidio ayer descongelx100 (3 descongel mas 1 cj multi x400)" },
            { nombre: "bibiana, esmeralda (M y D)", telefono: "3213712473", observaciones: "pide por drosan (deysi drosan)" },
            { nombre: "Danilo(cler recreo)", telefono: "3157105112", observaciones: "pedidos Danilo" },
            { nombre: "JORDAN (drog florida)", telefono: "", observaciones: "pedidos drosan wolfarma" },
            { nombre: "martha(unica pcta)", telefono: "3114990014", observaciones: "pedidos drosan (yolanda) pendientes pagos descongel multidol 400" },
            { nombre: "Nayara,Javier(mediexpress)", telefono: "3107622018", observaciones: "pedidos drosan(xxx)Nayara" },
            { nombre: "marcela(superdrogas)", telefono: "3128945193", observaciones: "cra 15#3-124 cambiar direccion" },
            { nombre: "yina(vital salud)", telefono: "3178418227", observaciones: "unidrogas" },
            { nombre: "Margy(jerez)", telefono: "3187787283", observaciones: "drosan ( )Luz Mary Jerez - modificar dir cra 15#6-90" },
            { nombre: "alix (san rafael)", telefono: "3174043516", observaciones: "pedidos con la Sra Alix" },
            { nombre: "Lilia Corzo(lico)", telefono: "3158862134", observaciones: "Pedidos con la sra Lidia" },
            { nombre: "Yadira(la 7ma Pcta)", telefono: "3232060182", observaciones: "drosan (yolanda) -- fluzetrin cbg + multi 400(sabado) 3132018154" },
            { nombre: "Daniela, Eliecer(ecovida)", telefono: "3168052998", observaciones: "pedidos con Andrea(ecovida 2)" },
            { nombre: "jessica(granados amiga)", telefono: "3176678147", observaciones: "pedidos jessica" },
            { nombre: "Miguel(lorena)", telefono: "3004860613", observaciones: "pedidos (drosan) isabel pedido mañana 8 mayo descongel x100" },
            { nombre: "Harvey (unifarma)", telefono: "3212506845", observaciones: "pedidos con el Sr Harvey(pedidos)" },
            { nombre: "Fernando(la 16 san carlos),Laura", telefono: "3232968472", observaciones: "pedidos con el Sr Fernando" },
            { nombre: "Tatiana(umefa)", telefono: "", observaciones: "se realiza pedido de dolfenax,multidol 400,clobezan" },
            { nombre: "Jorge(granados centro)", telefono: "6979961", observaciones: "cll 11#23 pedidos con William o Esmeralda" },
            { nombre: "Doris,Rosa(drg felix)", telefono: "3044505976", observaciones: "pendiente inventario porque esta recibiendo pedido. 3166256307- Doris" },
            { nombre: "Luz mabe(campo hermoso)", telefono: "3186340114", observaciones: "pedidos con Rosa o Doris en la Felix (1 bifidolac +2 fluzetrin capsu)" },
            { nombre: "Paola(nueva avenida)", telefono: "3003504784", observaciones: "pedidos con paola" },
            { nombre: "Lidis(pharmalis)", telefono: "", observaciones: "pedidos Lidis. se hace trasnferencia de estermax crema y descongel x100" },
            { nombre: "Fernando(el carmen)", telefono: "", observaciones: "Duopas 1, pedido de descongel x100 (mariela) (hollman-DROSAN)" },
            { nombre: "mariana(farmaexpress)", telefono: "3204008446", observaciones: "necesita Multidol x800....jennifer pedidos whatsapp. PAGUE $5000 CJ DESCONGELX100" },
            { nombre: "Adriana(farmagomez)-Samy", telefono: "", observaciones: "pedidos Dina Luz - Samy 2pm" },
            { nombre: "Felsomina(Maria Reyna)", telefono: "3172795351", observaciones: "8-11:30 am pedidos" },
            { nombre: "Nathaly(granados limoncito)", telefono: "", observaciones: "Gerson (pedidos en la del parque) horas AM" },
            { nombre: "Gabriel(altamira)", telefono: "", observaciones: "pedidos con el Sr Gabriel" },
            { nombre: "celestino(jael)", telefono: "3154058174", observaciones: "pedidos proxima visita" },
            { nombre: "sila(cadfarma)", telefono: "3174308550", observaciones: "pedidos con la sra Marcela al numero registrado" },
            { nombre: "Dora(jotaerre)", telefono: "3054693748", observaciones: "pedidos en Copidrogas y udrosan (COMPRAS SR JULIO)" },
            { nombre: "martha(carios)", telefono: "3156670846", observaciones: "pedidos por copi. transferencia Estermax tabletas" },
            { nombre: "william(drog s.c)", telefono: "3155333632", observaciones: "pedidos Sr William" },
            { nombre: "rafael(zambrano plus)", telefono: "3146314022", observaciones: "realizara pedido el dia de feria" },
            { nombre: "Gladys-Jorge(la colombia)", telefono: "3185858760", observaciones: "pedidos martes y jueves" },
            { nombre: "fabio(deposito centro)", telefono: "3102330406", observaciones: "Enviar ofertas Al sr Carlos Portila" },
            { nombre: "Jaime(pinzon)", telefono: "", observaciones: "transferencia trigentax 20 y 40(6-6) descongel x100(4) fluzetrin cbg(4)" },
            { nombre: "Diego(pague menos sotomayor)", telefono: "", observaciones: "se realiza capacitacion se portafolio con el admin diego" },
            { nombre: "Mauricio (drog esquina la 56)", telefono: "3124002613", observaciones: "cambiar direccion Cra 23#52-27" },
            { nombre: "Jose luis(drg sotomayor)", telefono: "3168284101", observaciones: "enviar catalogo de precios" },
            { nombre: "Laura(granados bucarica)", telefono: "3165893659", observaciones: "pedidos con Ingrid Caña en horas AM." },
            { nombre: "madeleine(la y)", telefono: "3234272903", observaciones: "pedidos com ingrid caña de GRANADOS BUCARICA" },
            { nombre: "Dayra(caracoli)", telefono: "3104807318", observaciones: "pedidos con eugenio horas AM" },
            { nombre: "Luz Elena(taysof)", telefono: "3112305849", observaciones: "pedidos por Drosan, Unidrogas" },
            { nombre: "Sebastian(skala)", telefono: "3188723369", observaciones: "hugo pedidos tipo (2pm)" },
            { nombre: "briggith(la mejor lebrija)", telefono: "3162254245", observaciones: "Jonathan ramirez pedidos" },
            { nombre: "cristina(rosanel)", telefono: "3162687959", observaciones: "pedidos con Edward en superDrogas lebrija" },
            { nombre: "Edward(SuperDrogas Lebrija)", telefono: "3152517248", observaciones: "pedidos con Edward en superDrogas lebrija" },
            { nombre: "Sandra(dromisalud)", telefono: "", observaciones: "pedidos con Edward en superDrogas lebrija" },
            { nombre: "Martha(lebrifarma)", telefono: "3178304746", observaciones: "Drosan (cristian jair)" },
            { nombre: "Edwin(intermundial)", telefono: "3222178472", observaciones: "Celia Marina pedidos con laa sra Celia al whatsapp 3185978884" },
            { nombre: "Armando(drg la septima lebrija)", telefono: "", observaciones: "cambiar direccion cl 11#10-21 - descongelito(" },
            { nombre: "Yury(botica express)", telefono: "", observaciones: "pedidos con Edward en superDrogas lebrija" },
            { nombre: "Daniel(farma gomez matias)", telefono: "3184211242", observaciones: "Ahora se llama D-Max" },
            { nombre: "Jorge Florez(jerez villabel)", telefono: "3155187213", observaciones: "Cambiar nombre y direccion (Granados Villabel - cra 12#5-12 Lc 2)3209403294" },
            { nombre: "Orlamdo(lorce)", telefono: "3203334952", observaciones: "piden por carmencita" },
            { nombre: "adela mantilla(carmencita)", telefono: "3043750163", observaciones: "pedidos Adela 11-11:30am (se realiza pago MULTIDOL X400-7 , DESCONGEL -1) AIRMAX 3 UNDS. 1 desconx100, descongelitox3-2, multidolx800-2, multidolx400-1, trigentax x20-3, neuropronx3-3)pdte DESCONX100,DESCONX3,NEUROPRON." },
            { nombre: "jhon rojas(maximed)", telefono: "3156357993", observaciones: "jhon rojas drosan(hollman), unidrogas" },
            { nombre: "Marcela(pharmaluc)", telefono: "3174032243", observaciones: "pedidos copi (pendiente descongel x100)" },
            { nombre: "Nidia(globalfarma)", telefono: "3208104384", observaciones: "pedidos" },
            { nombre: "Saulo(la cumbre)", telefono: "3203206687", observaciones: "pedidos (con el sr Saulo)" },
            { nombre: "Andres(la virtud)", telefono: "3157221849", observaciones: "Alfonso Ortiz (realiza transferencias atendiendo por whastapp)" },
            { nombre: "Edwin(Ecomed)", telefono: "3107869750", observaciones: "Sr Edwin pedidos 9-1pm" },
            { nombre: "Camila(D Y J plus)", telefono: "3204618876", observaciones: "Pedidos con la sra Cecilia horas Pm" },
            { nombre: "Hernando(comvida)", telefono: "3176528299", observaciones: "pedidos con el Sr Hernando (se pagan 6 cjs multidolx400), descongex100-1" },
            { nombre: "Edgar(angela Mariana)", telefono: "", observaciones: "pedidos con el Sr Edgar en horas AM" },
            { nombre: "Alex(alirio lopez 2)", telefono: "3026093915", observaciones: "pedidos con el Sr Alex" },
            { nombre: "Marleni(paola)", telefono: "3184418807", observaciones: "pedidos con Marleni" },
            { nombre: "Jenny(santa cruz plus)", telefono: "3105511558", observaciones: "Monica pedidos despues de 10 am" },
            { nombre: "Harold(drg arenales)", telefono: "3124493663", observaciones: "pedidos con el Sr Harold" },
            { nombre: "Robinson(Valery)", telefono: "3172362214", observaciones: "pedidos Drosan (Hollman)" },
            { nombre: "Tiberio(sana sanar)", telefono: "3209855052", observaciones: "drosan (ricardo vadillo) se pagan multidol x800-4" },
            { nombre: "Nelly(las villas)", telefono: "3202039638", observaciones: "Drosan(isabel) pago multidolx400-2" },
            { nombre: "Laura(las villas de san juan)", telefono: "3144756906", observaciones: "drosan (fabio)" },
            { nombre: "Wilson(cambulos)", telefono: "3160529491", observaciones: "drosan (Ricardo)" },
            { nombre: "German, Cesar(unicentro)", telefono: "3208081288", observaciones: "Pedidos German, Cesar" },
            { nombre: "Oscar(vital)", telefono: "3177779880", observaciones: "se realiza transferencia de 15 unidades airmax" },
            { nombre: "angelica(super descuentos)", telefono: "3172278532", observaciones: "cambiar razon social (FARMA TE CUIDA)" },
            { nombre: "Carlos(Drg Cler)", telefono: "3125668788", observaciones: "pedidos Sr Carlos" },
            { nombre: "Esther(Famisalud)", telefono: "3142594702", observaciones: "pedidos Famisalud (pague 1 multidolx800, y un descongelx100)" },
            { nombre: "Cecilia(famisalud oasis)", telefono: "3186160676", observaciones: "se facturan 106 unds Zakor y 4 unds Airmax" },
            { nombre: "Julieth(farmavillas 3)", telefono: "", observaciones: "pedidos con el Sr Ariel en horas AM" },
            { nombre: "Agustin(granados reposo)", telefono: "3016690442", observaciones: "pedidos con el Sr Agustin" },
            { nombre: "Edith(la 58)", telefono: "3223216639", observaciones: "pedidos" },
            { nombre: "Erasmo(nueva luz)", telefono: "3182927931", observaciones: "Wilmar pedidos en horas AM" },
            { nombre: "juan carlos(granados San bernando)", telefono: "3115571002", observaciones: "pedidos con la Sra Alba" },
            { nombre: "Nelson(pharma todo san alberto)", telefono: "3164389314", observaciones: "Drosan(jony ofertas 2 trigx20, descnx100 1 cja, 6 zakor, 2 descongelito)" },
            { nombre: "Wilman(el veleño)san alberto", telefono: "3102194541", observaciones: "pedido por Copi" },
            { nombre: "Albeiro(HL)san alberto", telefono: "3208638448", observaciones: "pedido por copi" },
            { nombre: "Luis Carlos(servic-d)san martin", telefono: "3166207949", observaciones: "pagos cajas( 28 multix800, 5 multix400,2 desconx100)" },
            { nombre: "David(drg castillo)san martin", telefono: "3213238940", observaciones: "se visita cliente y por el momento esta bien de inventarios" },
            { nombre: "(la trinidad)san martin", telefono: "", observaciones: "no estan realizando transferencia. No se atienden transferencias por el momento." },
            { nombre: "Octavio(farmasalud universal)san martin", telefono: "3152060974", observaciones: "pago cajas (32 multix800, 3 multix400, 5 desconx100)" },
            { nombre: "Edward(mas x menos, Aguachica)", telefono: "3164129811", observaciones: "realizo pedido con Leidy" },
            { nombre: "zuleima(valery sofia)pelaya", telefono: "3126501729", observaciones: "Darlys pedidos" },
            { nombre: "Geiner(super drogas parra)pelaya", telefono: "3205438805", observaciones: "Jony parra pedidos" },
            { nombre: "Marcela(JERCHRIAS)pelaya", telefono: "", observaciones: "Maria Victoria, y los pedidos por SuperDrogas Parra con El sr Jony" },
            { nombre: "Diana(Farma Vida)Pelaya", telefono: "3108687307", observaciones: "Carol pedidos" },
            { nombre: "Angelica(DROGUERIA JUSTY MORENO)pelaya", telefono: "3150276263", observaciones: "DROGUERIA JUSTY MORENO cambio direccion Cra8#6-60, pedidos Sra Justina" },
            { nombre: "Rosalba(curita plus2) aguachica", telefono: "3175861298", observaciones: "Pedidos con la sra Rosalba" },
            { nombre: "Jose Luis(bendita plus)gamarra", telefono: "3178573098", observaciones: "se pagan cajas y pedido por copi (4 multix800, 19 descon x100, 2 multix400)" },
            { nombre: "Nohora(san jorge)aguachica", telefono: "3187161897", observaciones: "pedidos con nohora" },
            { nombre: "samuel(curita plus)aguachica", telefono: "3147808780", observaciones: "pedidos con el Sr Manuel, Se pagan 3 multix800" },
            { nombre: "Luis Perez(maxi drogas) aguachica", telefono: "3163156411", observaciones: "pedido pendiente por feria" },
            { nombre: "Javier Ubaldia(medilat 2)", telefono: "", observaciones: "esta vendiendo la farmacia" },
            { nombre: "Karen(aguachica)aguachica", telefono: "3013025195", observaciones: "pide solo por eticos" },
            { nombre: "Dioselina, Daniela(salud y belleza)", telefono: "3108250462", observaciones: "Drosan(yony)6 unds zakor, 4 neuropronx3, 2 fluzetrin gotas," },
            { nombre: "Cindy(pague menos) aguachica", telefono: "", observaciones: "se pagan (26 desconx100, 12 multix800)" },
            { nombre: "Nelson(la nueva)ocaña", telefono: "3112195518", observaciones: "Drosan. Ya realizo pedido" },
            { nombre: "Ricardo(megafarma ocaña)", telefono: "3152379160", observaciones: "Ricardo Gallargo dueño, no se encuentra en este momento PAGO 1 CAJA DESCONX100" },
            { nombre: "Daneris(tarigua)ocaña", telefono: "3158229947", observaciones: "Drosan pedia" },
            { nombre: "karen(drog 2020)ocaña", telefono: "3152312701", observaciones: "Adrian encargado pedidos para el pdv" },
            { nombre: "Jesus(Clavijo)ocaña", telefono: "3176700417", observaciones: "pedidos con el Sr Jesus(multix400-1, multix800-1, tigenx20-6 x40-3, friotanxjbe-6,fluzetrinxCBG6,jbe 3,gotas3...3 infla x8mg....clobe loc 6 y 6 ungto.....2 fluturan.....dolfe...3.....lactu jbe 1 y cj 1......arimax....)" },
            { nombre: "Javier( santa ana)ocaña", telefono: "3173798363", observaciones: "Unidrogas se realizan unicamente" },
            { nombre: "Maryori(la 13 de ocaña)", telefono: "3187952096", observaciones: "Copidrogas....pago de 1 cj desconx100 y 1 cj multi x400" },
            { nombre: "Karina(la doce de ocaña)", telefono: "3156205626", observaciones: "pedidos con la sra Karina" },
            { nombre: "Ramon(Central de Ocaña)", telefono: "3154769519", observaciones: "pedidos (12 descongelito Drosan analudy)" },
            { nombre: "Victor(farma paez) abrego", telefono: "3228562091", observaciones: "armando farmapaez PAGO 1 CJ DESCONX100" },
            { nombre: "Karen(pharmakos) abrego", telefono: "3184827023", observaciones: "Claudia encargada de Chalver" },
            { nombre: "(santa isabel)abrego", telefono: "", observaciones: "cambio dir CR.6 # 13 - 64 (B. CENTRO)" },
            { nombre: "juan Jose(unidrogas) abrego", telefono: "3176799098", observaciones: "PAGO 8 CJS DESCONX100" },
            { nombre: "Yesica(drg abrego)", telefono: "3165817327", observaciones: "martha encargada" },
            { nombre: "Dinael(MAXIDROGAS ABREGO)", telefono: "3176682947", observaciones: "Presentacion de portafolio CLIENTE PARA INCLUIR PANEL 42179" },
            { nombre: "Alfredo(la 10) ocaña", telefono: "3163407519", observaciones: "se realiza pedido para aplicar 10% DPE" },
            { nombre: "Eduardo(drg pineda) ocaña", telefono: "3178137258", observaciones: "se realiza presentación de portafolio y queda pendiente el pedido" },
            { nombre: "Yura(drogueria x2)ocaña", telefono: "", observaciones: "se realizo transfeerencia" },
            { nombre: "Hector(drg ocaña)ocaña", telefono: "", observaciones: "pedidos con Nairon" },
            { nombre: "Mauricio(drog san agustin)ocaña", telefono: "3166588287", observaciones: "No se visitaba y pide ofertas" },
            { nombre: "Manuel(bettel)ocaña", telefono: "3015992969", observaciones: "realiza pedidos por transferencias" },
            { nombre: "Laura(la equis)ocala", telefono: "3115440967", observaciones: "SE PAGAN (7..CJS DESCONX100....2..MULTIDOLX400....2..multidolx800)" },
            { nombre: "Fabian(drogas salud)ocaña", telefono: "", observaciones: "Yudy clemencia encargada pedidos" },
            { nombre: "Gerardo(avenida ocaña)", telefono: "3188846618", observaciones: "Wilder encargado" },
            { nombre: "hermes(la lupita) santa clara", telefono: "3176878730", observaciones: "se realiza transfrencia de productos" },
            { nombre: "alfredo(riaño) santa clara", telefono: "", observaciones: "drosan (ana ludi) 1 oferta multidolx400 2+1....1 ofert 3 trigx20 gts 12ML" },
            { nombre: "Adrian(total confianza)santa coara", telefono: "3186053287", observaciones: "Ledy paredes encargada de pedidos y siempre atiende despues de las 3pm" },
            { nombre: "jose luis(la X4)santa clara", telefono: "3162355562", observaciones: "fluz 1...1..1..trg x20 ....40...duoop 1...vagins crem 1...1 ovulo...inflacor 3+3 y 6+6.....bifidolac...lactulax" },
            { nombre: "Maria (santa clara)", telefono: "3224676804", observaciones: "drosan (ludy) PENDIENTE PEDIDO LA PROXIMA SEMAMA MAYO 26 AL 30" },
            { nombre: "Edier (la equis 5)ocaña", telefono: "", observaciones: "pedidos con Laura en la Equis principal PREGUNTAR RECAMBIO SIMPAUSE 2+1" },
            { nombre: "Blanca (drg Leon)", telefono: "3102538626", observaciones: "pedidos por copi" },
            { nombre: "Jonathan(farmatotal mas)", telefono: "3176496802", observaciones: "copi pedido realizado" },
            { nombre: "jesus (manuel beltran)", telefono: "3188485204", observaciones: "drosan (ricardo)" },
            { nombre: "Leonardo(mx alkosto)", telefono: "3182667182", observaciones: "drosan(fabio, richard)" },
            { nombre: "(1a total)", telefono: "", observaciones: "la clienta realiza pedidos directamente" },
            { nombre: "Esperanza( luz del porvenir)", telefono: "3134606389", observaciones: "pedidos por Copidrogas (SE PAGAN 4 DESCONGEL X100)" },
            { nombre: "Fernanda(granados san francisco)", telefono: "3003166509", observaciones: "pedidos con el Sr Hector en la Cra 27...atencion con el Sr Hector los viernes horas AM" },
            { nombre: "Fabian(san carlos)", telefono: "3142565459", observaciones: "Pedidos con Maria Teresa horas PM" },
            { nombre: "Fany(san pablo)", telefono: "3173075893", observaciones: "drosan (sneider)" },
            { nombre: "Lorena(drg bulevar)", telefono: "3154658937", observaciones: "Andrea rey encargada de pedidos por Drosan" },
            { nombre: "Esperanza(santa cecilia)", telefono: "3224314683", observaciones: "Drosan (hollman)" },
            { nombre: "Cristobal(farmasolano)", telefono: "3026970806", observaciones: "pedidos con Cristofer horas PM" },
            { nombre: "Carolina(Drg Dorena)", telefono: "3186420941", observaciones: "Copi pedidos" },
            { nombre: "Cristina(victoria de los reyes)", telefono: "3205472237", observaciones: "Drosan" },
            { nombre: "Hernan(central)", telefono: "3156123777", observaciones: "Drosan(wilson)" },
            { nombre: "Samuel(la victoria)", telefono: "3134206185", observaciones: "Drosan(jhon caceres)" },
            { nombre: "Karen(linea vital)", telefono: "3159283791", observaciones: "Copidrogas" },
            { nombre: "Alejandra(ahorramax)", telefono: "3142326136", observaciones: "edinson pedidos PM despues de las 4" },
            { nombre: "Anyi(drg refugio)", telefono: "3165382152", observaciones: "Maria eugenia encargada de los pedidos ausente por el momento" },
            { nombre: "Ana(drg Dmax)", telefono: "3228338846", observaciones: "Copidrogas Jeimy Niño- Jean carlos 3163529947" },
            { nombre: "Carlos(entre parques)", telefono: "3182758833", observaciones: "Copi pedidos CAMBIO NOMBRE BOSQUES DE ARANJUEZ" },
            { nombre: "Andrea(Ekonofarma)", telefono: "3043672834", observaciones: "Drosan pedidos" },
            { nombre: "Giovanny(medifarma)", telefono: "3219450101", observaciones: "Erika pedidos PM despues de 6" },
            { nombre: "Sebastian(medicam plus )", telefono: "3203923863", observaciones: "encargado de pedidos sebastian" },
            { nombre: "Adrianis(Granados puente)", telefono: "3208928626", observaciones: "pedidos con Leidy Granados encargada" },
            { nombre: "Sergio(Jerez paseo del puente)", telefono: "3174033369", observaciones: "pedido transferencia y pendiente MULTIDOL X400 Y 800" },
            { nombre: "Felipe(rivera pharma)", telefono: "3108011852", observaciones: "encargado ausente Felipe" },
            { nombre: "Omar(ecofarma paseo del Puente)", telefono: "3107829411", observaciones: "pedidos con Omar" },
            { nombre: "Jair(camargo)", telefono: "3148718627", observaciones: "pedidos con jair, no se encuentra en el momento." },
            { nombre: "Camila(Edimar Plus)", telefono: "3112591187", observaciones: "pedidos con la sra Liliana Copidrogas" },
            { nombre: "Olga(salbe)", telefono: "3143744022", observaciones: "Pedidos con la sra liliana" },
            { nombre: "Karen(pharmalagos)", telefono: "3104807318", observaciones: "Pedidos con Eugenio en Caracoli" },
            { nombre: "Johana(gran Boulevard)", telefono: "3013335594", observaciones: "pedidos por copi" },
            { nombre: "Fredy(farmaciudadela)", telefono: "3005060010", observaciones: "pedidos primeramente Copi, TRANSFERENCIA DROSAN(sabastian) ZAKOR 48 unds" },
            { nombre: "Blanca(blantony)", telefono: "3188859096", observaciones: "pedidos por Copi, cutamycon ovulo 1....terex 3... Drosan (ariel)" },
            { nombre: "Ruth(plaza Plaza Mayor)", telefono: "3155900100", observaciones: "drosan Laura pedidos hija" },
            { nombre: "Rosalba-Ana(famysalud)", telefono: "3142742670", observaciones: "pedidos Emilse antes de las 11am" },
            { nombre: "Alejandra(farma claro)", telefono: "3123254117", observaciones: "pedidos con la sra Alejandra" },
            { nombre: "Julio Cesar(granados mutis)", telefono: "3138177726", observaciones: "pedidos Yesid provenza" },
            { nombre: "jose Gabriel(la paz 2)", telefono: "3193923870", observaciones: "Miriam pedidos (drosan, Unidrogas)" },
            { nombre: "jean carlos(farma gomez)", telefono: "3053652574", observaciones: "pedidos con el sr Jean Carlos" }
        ];

        this.init();
    }

    // 🚀 Inicialización
    init() {
        console.log('🚀 Sistema Zona 1561 - 182 Registros Iniciado');
        this.loadFromCache();
        this.setupEventListeners();
        this.renderTable();
        this.updateStats();
        this.showWelcomeMessage();
    }

    // 📊 Cargar datos
    loadFromCache() {
        const cached = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (cached) {
            try {
                this.farmacias = JSON.parse(cached);
                console.log(`📥 ${this.farmacias.length} registros cargados desde caché`);
            } catch (error) {
                console.error('❌ Error al cargar caché:', error);
                this.farmacias = [...this.initialData];
                this.saveToCache();
            }
        } else {
            this.farmacias = [...this.initialData];
            this.saveToCache();
            console.log(`📋 ${this.farmacias.length} registros iniciales cargados`);
        }
    }

    // 💾 Guardar en caché
    saveToCache() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.farmacias));
            console.log('💾 Datos guardados');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            return false;
        }
    }

    // 🎯 Event listeners
    setupEventListeners() {
        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilter = e.target.value;
                this.renderTable();
            }, 300));
        }

        // Formulario
        const form = document.getElementById('farmaciaForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveFarmacia();
            });
        }

        // Teclas globales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveToCache();
                this.showAlert('💾 Datos guardados manualmente', 'success');
            }
        });

        // Cerrar modal
        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') this.closeModal();
            });
        }
    }

    // ⏱️ Debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 📊 Renderizar tabla simple
    renderTable() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        let filteredData = this.applyFilters();
        tbody.innerHTML = '';

        if (filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #6b7280;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <h3 style="margin-bottom: 10px;">No se encontraron resultados</h3>
                        <p>Total de registros: ${this.farmacias.length}</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredData.forEach((farmacia, index) => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            
            const originalIndex = this.getOriginalIndex(farmacia);
            
            row.innerHTML = `
                <td>
                    <div class="nombre-container">
                        <strong style="color: #2563eb; font-size: 1.05rem;">
                            ${this.highlightSearchTerm(farmacia.nombre)}
                        </strong>
                    </div>
                </td>
                <td>
                    <div class="telefono-container">
                        ${farmacia.telefono ? `
                            <a href="tel:${farmacia.telefono}" class="btn btn-sm telefono-btn">
                                <i class="fas fa-phone"></i> ${farmacia.telefono}
                            </a>
                            <a href="https://wa.me/57${farmacia.telefono}" target="_blank" class="btn btn-sm whatsapp-btn" title="WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        ` : '<span style="color: #ef4444; font-weight: 600;">⚠️ Sin teléfono</span>'}
                    </div>
                </td>
                <td>
                    <div class="observaciones-simple">
                        ${this.highlightSearchTerm(farmacia.observaciones || 'Sin observaciones')}
                    </div>
                </td>
                <td>
                    <div class="acciones-simples">
                        <button class="btn btn-warning btn-sm" onclick="farmaciaManager.editFarmacia(${originalIndex})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="farmaciaManager.deleteFarmacia(${originalIndex})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Animación
        this.animateRows();
    }

    // 🔍 Aplicar filtros
    applyFilters() {
        if (!this.currentFilter) return this.farmacias;
        
        return this.farmacias.filter(farmacia => {
            const searchFields = [
                farmacia.nombre,
                farmacia.telefono,
                farmacia.observaciones
            ];
            
            return searchFields.some(field => 
                field && field.toLowerCase().includes(this.currentFilter.toLowerCase())
            );
        });
    }

    // 🎨 Resaltar búsqueda
    highlightSearchTerm(text) {
        if (!this.currentFilter || !text) return text;
        
        const regex = new RegExp(`(${this.currentFilter})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    // ✨ Animación
    animateRows() {
        const rows = document.querySelectorAll('.table-row');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 20);
        });
    }

    // 📈 Actualizar estadísticas
    updateStats() {
        const totalElement = document.getElementById('totalFarmacias');
        if (totalElement) {
            totalElement.textContent = this.farmacias.length;
        }
    }

    // 🔍 Obtener índice original
    getOriginalIndex(farmacia) {
        return this.farmacias.findIndex(f => 
            f.nombre === farmacia.nombre && 
            f.telefono === farmacia.telefono
        );
    }

    // ➕ Mostrar modal
    showModal() {
        document.getElementById('modal').style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Agregar Farmacia';
        document.getElementById('farmaciaForm').reset();
        this.editingIndex = -1;
        document.getElementById('nombre').focus();
    }

    // ❌ Cerrar modal
    closeModal() {
        document.getElementById('modal').style.display = 'none';
        this.editingIndex = -1;
    }

    // 💾 Guardar farmacia
    saveFarmacia() {
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        if (!nombre) {
            this.showAlert('❌ El nombre es obligatorio', 'error');
            return;
        }

        const farmacia = { nombre, telefono, observaciones };

        if (this.editingIndex >= 0) {
            this.farmacias[this.editingIndex] = farmacia;
            this.showAlert('✅ Farmacia actualizada', 'success');
        } else {
            this.farmacias.push(farmacia);
            this.showAlert('✅ Farmacia agregada', 'success');
        }

        this.saveToCache();
        this.renderTable();
        this.updateStats();
        this.closeModal();
    }

    // ✏️ Editar farmacia
    editFarmacia(index) {
        const farmacia = this.farmacias[index];
        
        document.getElementById('nombre').value = farmacia.nombre;
        document.getElementById('telefono').value = farmacia.telefono;
        document.getElementById('observaciones').value = farmacia.observaciones;
        
        document.getElementById('modalTitle').textContent = 'Editar Farmacia';
        document.getElementById('modal').style.display = 'block';
        this.editingIndex = index;
    }

    // 🗑️ Eliminar farmacia
    deleteFarmacia(index) {
        const farmacia = this.farmacias[index];
        
        if (confirm(`¿Eliminar "${farmacia.nombre}"?`)) {
            this.farmacias.splice(index, 1);
            this.saveToCache();
            this.renderTable();
            this.updateStats();
            this.showAlert('🗑️ Farmacia eliminada', 'success');
        }
    }

    // 📤 Exportar a Excel
    exportToExcel() {
        try {
            const dataToExport = this.farmacias.map(f => ({
                'NOMBRE': f.nombre,
                'TELEFONO': f.telefono,
                'OBSERVACIONES': f.observaciones
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ZONA_1561_182REGISTROS');

            const fecha = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `ZONA_1561_182registros_${fecha}.xlsx`);

            this.showAlert(`📊 Excel exportado: ${this.farmacias.length} registros`, 'success');
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showAlert('❌ Error al exportar', 'error');
        }
    }

    // 📢 Mostrar alertas
    showAlert(message, type) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = message;

        const container = document.querySelector('.container');
        container.insertBefore(alert, container.firstChild);

        setTimeout(() => alert.remove(), 4000);
    }

    // 🎉 Mensaje de bienvenida
    showWelcomeMessage() {
        setTimeout(() => {
            this.showAlert(`🎯 Sistema listo: ${this.farmacias.length} registros de Zona 1561 cargados`, 'success');
        }, 1000);
    }
}

// 🚀 Funciones globales
let farmaciaManager;

function showModal() {
    farmaciaManager.showModal();
}

function closeModal() {
    farmaciaManager.closeModal();
}

function exportToExcel() {
    farmaciaManager.exportToExcel();
}

// 🎯 Inicializar
document.addEventListener('DOMContentLoaded', () => {
    farmaciaManager = new FarmaciaManager();
    console.log('🎯 Sistema Zona 1561 con 182 registros - ¡Listo para ventas!');
});

// 🛡️ Auto-guardar al salir
window.addEventListener('beforeunload', () => {
    if (farmaciaManager) {
        farmaciaManager.saveToCache();
    }
});
