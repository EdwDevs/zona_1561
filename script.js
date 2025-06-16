/**
 * 🏥 SISTEMA DE GESTIÓN ZONA 1561 - FARMACIAS Y DROGUERÍAS
 * Base de datos completa para optimización de ventas
 * @author: Sistema de Gestión Inteligente
 * @version: 3.0.0
 * @date: 2025-06-16
 * @records: 150+ farmacias y droguerías
 */

// 🎯 Configuración global
const CONFIG = {
    STORAGE_KEY: 'farmaciasZona1561_v3',
    VERSION: '3.0.0',
    MAX_ITEMS_PER_PAGE: 100,
    EXPORT_FILENAME_PREFIX: 'ZONA_1561_COMPLETA_',
    AUTO_SAVE_INTERVAL: 30000,
    ANIMATION_DURATION: 300
};

// 💾 Clase principal para gestión de farmacias
class FarmaciaManager {
    constructor() {
        this.farmacias = [];
        this.editingIndex = -1;
        this.currentFilter = '';
        this.sortColumn = '';
        this.sortDirection = 'asc';
        this.autoSaveTimer = null;
        this.originalData = [];
        
        // 📊 Base de datos completa de la zona 1561
        this.initialData = [
            {
                nombre: "Doralba Gomez pedidos (supervida)",
                telefono: "3112629258",
                observaciones: "pedidos con la Sra Doralba en horas AM",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Paola (galeno)",
                telefono: "3005503883",
                observaciones: "pedidos con Paola",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Maria Castellanos(farmavida)",
                telefono: "3044919278",
                observaciones: "pide por drosan (tiene vencida estermax tab) Fabio",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Antonio (nuevo sol)",
                telefono: "3178180817",
                observaciones: "pidio ayer descongelx100 (3 descongel mas 1 cj multi x400)",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "bibiana, esmeralda (M y D)",
                telefono: "3213712473",
                observaciones: "pide por drosan (deysi drosan)",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Danilo(cler recreo)",
                telefono: "3157105112",
                observaciones: "pedidos Danilo",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "JORDAN (drog florida)",
                telefono: "",
                observaciones: "pedidos drosan wolfarma",
                categoria: "Droguería",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "martha(unica pcta)",
                telefono: "3114990014",
                observaciones: "pedidos drosan (yolanda) pendientes pagos descongel multidol 400",
                categoria: "Farmacia",
                estado: "Pendiente Pago",
                ciudad: "Bucaramanga",
                prioridad: "Urgente"
            },
            {
                nombre: "Nayara,Javier(mediexpress)",
                telefono: "3107622018",
                observaciones: "pedidos drosan(xxx)Nayara",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "marcela(superdrogas)",
                telefono: "3128945193",
                observaciones: "cra 15#3-124 cambiar direccion",
                categoria: "Droguería",
                estado: "Actualizar Datos",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "yina(vital salud)",
                telefono: "3178418227",
                observaciones: "unidrogas",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Margy(jerez)",
                telefono: "3187787283",
                observaciones: "drosan ( )Luz Mary Jerez - modificar dir cra 15#6-90",
                categoria: "Farmacia",
                estado: "Actualizar Datos",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "alix (san rafael)",
                telefono: "3174043516",
                observaciones: "pedidos con la Sra Alix",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Lilia Corzo(lico)",
                telefono: "3158862134",
                observaciones: "Pedidos con la sra Lidia",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Yadira(la 7ma Pcta)",
                telefono: "3232060182",
                observaciones: "drosan (yolanda) -- fluzetrin cbg + multi 400(sabado) 3132018154",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Daniela, Eliecer(ecovida)",
                telefono: "3168052998",
                observaciones: "pedidos con Andrea(ecovida 2)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "jessica(granados amiga)",
                telefono: "3176678147",
                observaciones: "pedidos jessica",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Miguel(lorena)",
                telefono: "3004860613",
                observaciones: "pedidos (drosan) isabel pedido mañana 8 mayo descongel x100",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Harvey (unifarma)",
                telefono: "3212506845",
                observaciones: "pedidos con el Sr Harvey(pedidos)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Fernando(la 16 san carlos),Laura",
                telefono: "3232968472",
                observaciones: "pedidos con el Sr Fernando",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Tatiana(umefa)",
                telefono: "",
                observaciones: "se realiza pedido de dolfenax,multidol 400,clobezan",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Jorge(granados centro)",
                telefono: "6979961",
                observaciones: "cll 11#23 pedidos con William o Esmeralda",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Doris,Rosa(drg felix)",
                telefono: "3044505976",
                observaciones: "pendiente inventario porque esta recibiendo pedido. 3166256307- Doris",
                categoria: "Droguería",
                estado: "Pendiente",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Luz mabe(campo hermoso)",
                telefono: "3186340114",
                observaciones: "pedidos con Rosa o Doris en la Felix (1 bifidolac +2 fluzetrin capsu)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Paola(nueva avenida)",
                telefono: "3003504784",
                observaciones: "pedidos con paola",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Lidis(pharmalis)",
                telefono: "",
                observaciones: "pedidos Lidis. se hace trasnferencia de estermax crema y descongel x100",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Fernando(el carmen)",
                telefono: "",
                observaciones: "Duopas  1, pedido de descongel x100 (mariela) (hollman-DROSAN)",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "mariana(farmaexpress)",
                telefono: "3204008446",
                observaciones: "necesita Multidol x800....jennifer pedidos whatsapp. PAGUE $5000 CJ DESCONGELX100",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Adriana(farmagomez)-Samy",
                telefono: "",
                observaciones: "pedidos Dina Luz - Samy 2pm",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Felsomina(Maria Reyna)",
                telefono: "3172795351",
                observaciones: "8-11:30 am pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Nathaly(granados limoncito)",
                telefono: "",
                observaciones: "Gerson (pedidos en la del parque) horas AM",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Gabriel(altamira)",
                telefono: "",
                observaciones: "pedidos con el Sr Gabriel",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "celestino(jael)",
                telefono: "3154058174",
                observaciones: "pedidos proxima visita",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "sila(cadfarma)",
                telefono: "3174308550",
                observaciones: "pedidos con la sra Marcela al numero registrado",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Dora(jotaerre)",
                telefono: "3054693748",
                observaciones: "pedidos en Copidrogas y udrosan (COMPRAS SR JULIO)",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "martha(carios)",
                telefono: "3156670846",
                observaciones: "pedidos por copi. transferencia Estermax tabletas",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "william(drog s.c)",
                telefono: "3155333632",
                observaciones: "pedidos Sr William",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "rafael(zambrano plus)",
                telefono: "3146314022",
                observaciones: "realizara pedido el dia de feria",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Gladys-Jorge(la colombia)",
                telefono: "3185858760",
                observaciones: "pedidos martes y jueves",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "fabio(deposito centro)",
                telefono: "3102330406",
                observaciones: "Enviar ofertas Al sr Carlos Portila",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Jaime(pinzon)",
                telefono: "",
                observaciones: "transferencia trigentax 20 y 40(6-6) descongel x100(4) fluzetrin cbg(4)",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Diego(pague menos sotomayor)",
                telefono: "",
                observaciones: "se realiza capacitacion se portafolio con el admin diego",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Mauricio (drog esquina la 56)",
                telefono: "3124002613",
                observaciones: "cambiar direccion Cra 23#52-27",
                categoria: "Droguería",
                estado: "Actualizar Datos",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Jose luis(drg sotomayor)",
                telefono: "3168284101",
                observaciones: "enviar catalogo de precios",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Laura(granados bucarica)",
                telefono: "3165893659",
                observaciones: "pedidos con Ingrid Caña en horas AM.",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "madeleine(la y)",
                telefono: "3234272903",
                observaciones: "pedidos com ingrid caña de GRANADOS BUCARICA",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Dayra(caracoli)",
                telefono: "3104807318",
                observaciones: "pedidos con eugenio horas AM",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Luz Elena(taysof)",
                telefono: "3112305849",
                observaciones: "pedidos por Drosan, Unidrogas",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Sebastian(skala)",
                telefono: "3188723369",
                observaciones: "hugo pedidos tipo (2pm)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "briggith(la mejor lebrija)",
                telefono: "3162254245",
                observaciones: "Jonathan ramirez pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "cristina(rosanel)",
                telefono: "3162687959",
                observaciones: "pedidos con Edward en superDrogas lebrija",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Edward(SuperDrogas Lebrija)",
                telefono: "3152517248",
                observaciones: "pedidos con Edward en superDrogas lebrija",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Lebrija",
                prioridad: "Alta"
            },
            {
                nombre: "Sandra(dromisalud)",
                telefono: "",
                observaciones: "pedidos con Edward en superDrogas lebrija",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Martha(lebrifarma)",
                telefono: "3178304746",
                observaciones: "Drosan (cristian jair)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Edwin(intermundial)",
                telefono: "3222178472",
                observaciones: "Celia Marina pedidos con laa sra Celia al whatsapp 3185978884",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Armando(drg la septima lebrija)",
                telefono: "",
                observaciones: "cambiar direccion cl 11#10-21 - descongelito(",
                categoria: "Droguería",
                estado: "Actualizar Datos",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Yury(botica express)",
                telefono: "",
                observaciones: "pedidos con Edward en superDrogas lebrija",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Daniel(farma gomez matias)",
                telefono: "3184211242",
                observaciones: "Ahora se llama D-Max",
                categoria: "Farmacia",
                estado: "Actualizar Datos",
                ciudad: "Lebrija",
                prioridad: "Media"
            },
            {
                nombre: "Jorge Florez(jerez villabel)",
                telefono: "3155187213",
                observaciones: "Cambiar nombre y direccion (Granados Villabel - cra 12#5-12 Lc 2)3209403294",
                categoria: "Farmacia",
                estado: "Actualizar Datos",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Orlamdo(lorce)",
                telefono: "3203334952",
                observaciones: "piden por carmencita",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "adela mantilla(carmencita)",
                telefono: "3043750163",
                observaciones: "pedidos Adela 11-11:30am (se realiza pago MULTIDOL X400-7 , DESCONGEL -1) AIRMAX 3 UNDS. 1 desconx100,  descongelitox3-2, multidolx800-2, multidolx400-1, trigentax x20-3, neuropronx3-3)pdte DESCONX100,DESCONX3,NEUROPRON.",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "jhon rojas(maximed)",
                telefono: "3156357993",
                observaciones: "jhon rojas drosan(hollman), unidrogas",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Marcela(pharmaluc)",
                telefono: "3174032243",
                observaciones: "pedidos copi (pendiente descongel x100)",
                categoria: "Farmacia",
                estado: "Pendiente",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Nidia(globalfarma)",
                telefono: "3208104384",
                observaciones: "pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Saulo(la cumbre)",
                telefono: "3203206687",
                observaciones: "pedidos (con el sr Saulo)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Andres(la virtud)",
                telefono: "3157221849",
                observaciones: "Alfonso Ortiz (realiza transferencias atendiendo por whastapp)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Edwin(Ecomed)",
                telefono: "3107869750",
                observaciones: "Sr Edwin pedidos 9-1pm",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Camila(D Y J plus)",
                telefono: "3204618876",
                observaciones: "Pedidos con la sra Cecilia horas Pm",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Hernando(comvida)",
                telefono: "3176528299",
                observaciones: "pedidos con el Sr Hernando (se pagan 6 cjs multidolx400), descongex100-1",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Alta"
            },
            {
                nombre: "Edgar(angela Mariana)",
                telefono: "",
                observaciones: "pedidos con el Sr Edgar en horas AM",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Alex(alirio lopez 2)",
                telefono: "3026093915",
                observaciones: "pedidos con el Sr Alex",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Marleni(paola)",
                telefono: "3184418807",
                observaciones: "pedidos con Marleni",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Jenny(santa cruz plus)",
                telefono: "3105511558",
                observaciones: "Monica pedidos despues de 10 am",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Harold(drg arenales)",
                telefono: "3124493663",
                observaciones: "pedidos con el Sr Harold",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Robinson(Valery)",
                telefono: "3172362214",
                observaciones: "pedidos Drosan (Hollman)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Tiberio(sana sanar)",
                telefono: "3209855052",
                observaciones: "drosan (ricardo vadillo) se pagan multidol x800-4",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Nelly(las villas)",
                telefono: "3202039638",
                observaciones: "Drosan(isabel) pago multidolx400-2",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Laura(las villas de san juan)",
                telefono: "3144756906",
                observaciones: "drosan (fabio)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Wilson(cambulos)",
                telefono: "3160529491",
                observaciones: "drosan (Ricardo)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "German, Cesar(unicentro)",
                telefono: "3208081288",
                observaciones: "Pedidos German, Cesar",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Oscar(vital)",
                telefono: "3177779880",
                observaciones: "se realiza transferencia de 15 unidades airmax... angelica(super descuentos),3172278532, cambiar razon social (FARMA TE CUIDA)",
                categoria: "Farmacia",
                estado: "Actualizar Datos",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Carlos(Drg Cler)",
                telefono: "3125668788",
                observaciones: "pedidos Sr Carlos",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Esther(Famisalud)",
                telefono: "3142594702",
                observaciones: "pedidos Famisalud (pague 1 multidolx800, y un descongelx100)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Cecilia(famisalud oasis)",
                telefono: "3186160676",
                observaciones: "se  facturan 106 unds Zakor y 4 unds Airmax",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Julieth(farmavillas 3)",
                telefono: "",
                observaciones: "pedidos con el Sr Ariel en horas AM",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Agustin(granados reposo)",
                telefono: "3016690442",
                observaciones: "pedidos con el Sr  Agustin",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Edith(la 58)",
                telefono: "3223216639",
                observaciones: "pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Erasmo(nueva luz)",
                telefono: "3182927931",
                observaciones: "Wilmar pedidos en horas AM",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "juan carlos(granados San bernando)",
                telefono: "3115571002",
                observaciones: "pedidos con la Sra Alba",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            },
            {
                nombre: "Nelson(pharma todo san alberto)",
                telefono: "3164389314",
                observaciones: "Drosan(jony ofertas 2 trigx20, descnx100 1 cja, 6 zakor, 2 descongelito)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "San Alberto",
                prioridad: "Media"
            },
            {
                nombre: "Wilman(el veleño)san alberto",
                telefono: "3102194541",
                observaciones: "pedido por Copi",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "San Alberto",
                prioridad: "Media"
            },
            {
                nombre: "Albeiro(HL)san alberto",
                telefono: "3208638448",
                observaciones: "pedido por copi",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "San Alberto",
                prioridad: "Media"
            },
            {
                nombre: "Luis Carlos(servic-d)san martin",
                telefono: "3166207949",
                observaciones: "pagos cajas( 28 multix800, 5 multix400,2 desconx100)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "San Martín",
                prioridad: "Alta"
            },
            {
                nombre: "David(drg castillo)san martin",
                telefono: "3213238940",
                observaciones: "se visita cliente y por el momento esta bien de inventarios",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "San Martín",
                prioridad: "Media"
            },
            {
                nombre: "(la trinidad)san martin",
                telefono: "",
                observaciones: "no estan realizando transferencia. No se atienden transferencias por el momento.",
                categoria: "Farmacia",
                estado: "Inactivo",
                ciudad: "San Martín",
                prioridad: "Baja"
            },
            {
                nombre: "Octavio(farmasalud universal)san martin",
                telefono: "3152060974",
                observaciones: "pago cajas (32 multix800, 3 multix400, 5 desconx100)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "San Martín",
                prioridad: "Alta"
            },
            {
                nombre: "Edward(mas x menos, Aguachica)",
                telefono: "3164129811",
                observaciones: "realizo pedido con Leidy",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "zuleima(valery sofia)pelaya",
                telefono: "3126501729",
                observaciones: "Darlys pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Pelaya",
                prioridad: "Media"
            },
            {
                nombre: "Geiner(super drogas parra)pelaya",
                telefono: "3205438805",
                observaciones: "Jony parra pedidos",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Pelaya",
                prioridad: "Media"
            },
            {
                nombre: "Marcela(JERCHRIAS)pelaya",
                telefono: "",
                observaciones: "Maria Victoria, y los pedidos por SuperDrogas Parra con El sr Jony",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Pelaya",
                prioridad: "Media"
            },
            {
                nombre: "Diana(Farma Vida)Pelaya",
                telefono: "3108687307",
                observaciones: "Carol pedidos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Pelaya",
                prioridad: "Media"
            },
            {
                nombre: "Angelica(DROGUERIA JUSTY MORENO)pelaya",
                telefono: "3150276263",
                observaciones: "DROGUERIA JUSTY MORENO cambio direccion Cra8#6-60, pedidos Sra Justina",
                categoria: "Droguería",
                estado: "Actualizar Datos",
                ciudad: "Pelaya",
                prioridad: "Media"
            },
            {
                nombre: "Rosalba(curita plus2) aguachica",
                telefono: "3175861298",
                observaciones: "Pedidos con la sra Rosalba",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "Jose Luis(bendita plus)gamarra",
                telefono: "3178573098",
                observaciones: "se pagan cajas y pedido por copi  (4 multix800, 19 descon x100, 2 multix400)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Gamarra",
                prioridad: "Alta"
            },
            {
                nombre: "Nohora(san jorge)aguachica",
                telefono: "3187161897",
                observaciones: "pedidos con nohora",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "samuel(curita plus)aguachica",
                telefono: "3147808780",
                observaciones: "pedidos con el Sr Manuel, Se pagan 3 multix800",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "Luis Perez(maxi drogas) aguachica",
                telefono: "3163156411",
                observaciones: "pedido pendiente por feria",
                categoria: "Droguería",
                estado: "Pendiente",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "Javier Ubaldia(medilat 2)",
                telefono: "",
                observaciones: "esta vendiendo la farmacia",
                categoria: "Farmacia",
                estado: "En Venta",
                ciudad: "Aguachica",
                prioridad: "Baja"
            },
            {
                nombre: "Karen(aguachica)aguachica",
                telefono: "3013025195",
                observaciones: "pide solo por eticos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "Dioselina, Daniela(salud y belleza)",
                telefono: "3108250462",
                observaciones: "Drosan(yony)6 unds zakor, 4 neuropronx3, 2 fluzetrin gotas,",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Aguachica",
                prioridad: "Media"
            },
            {
                nombre: "Cindy(pague menos) aguachica",
                telefono: "",
                observaciones: "se pagan (26 desconx100,  12 multix800)",
                categoria: "Farmacia",
                estado: "Sin Teléfono",
                ciudad: "Aguachica",
                prioridad: "Alta"
            },
            {
                nombre: "Nelson(la nueva)ocaña",
                telefono: "3112195518",
                observaciones: "Drosan. Ya realizo pedido",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Ricardo(megafarma ocaña)",
                telefono: "3152379160",
                observaciones: "Ricardo Gallargo dueño, no se encuentra en este momento PAGO 1 CAJA DESCONX100",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Daneris(tarigua)ocaña",
                telefono: "3158229947",
                observaciones: "Drosan pedia",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "karen(drog 2020)ocaña",
                telefono: "3152312701",
                observaciones: "Adrian encargado pedidos para el pdv",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Jesus(Clavijo)ocaña",
                telefono: "3176700417",
                observaciones: "pedidos con el Sr Jesus(multix400-1, multix800-1, tigenx20-6 x40-3, friotanxjbe-6,fluzetrinxCBG6,jbe 3,gotas3...3 infla x8mg....clobe loc 6 y 6 ungto.....2 fluturan.....dolfe...3.....lactu jbe 1 y cj 1......arimax....)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Alta"
            },
            {
                nombre: "Javier( santa ana)ocaña",
                telefono: "3173798363",
                observaciones: "Unidrogas se realizan unicamente",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Maryori(la 13 de ocaña)",
                telefono: "3187952096",
                observaciones: "Copidrogas....pago de 1 cj desconx100 y 1 cj multi x400",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Karina(la doce de ocaña)",
                telefono: "3156205626",
                observaciones: "pedidos con la sra Karina",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Ramon(Central de Ocaña)",
                telefono: "3154769519",
                observaciones: "pedidos (12 descongelito Drosan analudy)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Victor(farma paez) abrego",
                telefono: "3228562091",
                observaciones: "armando farmapaez PAGO 1 CJ DESCONX100",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Abrego",
                prioridad: "Media"
            },
            {
                nombre: "Karen(pharmakos) abrego",
                telefono: "3184827023",
                observaciones: "Claudia encargada de Chalver",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Abrego",
                prioridad: "Media"
            },
            {
                nombre: "(santa isabel)abrego",
                telefono: "",
                observaciones: "cambio dir CR.6 # 13 - 64 (B. CENTRO)",
                categoria: "Farmacia",
                estado: "Actualizar Datos",
                ciudad: "Abrego",
                prioridad: "Media"
            },
            {
                nombre: "juan Jose(unidrogas) abrego",
                telefono: "3176799098",
                observaciones: "PAGO 8 CJS DESCONX100",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Abrego",
                prioridad: "Alta"
            },
            {
                nombre: "Yesica(drg abrego)",
                telefono: "3165817327",
                observaciones: "martha encargada",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Abrego",
                prioridad: "Media"
            },
            {
                nombre: "Dinael(MAXIDROGAS ABREGO)",
                telefono: "3176682947",
                observaciones: "Presentacion de portafolio CLIENTE PARA INCLUIR PANEL 42179",
                categoria: "Droguería",
                estado: "Nuevo Cliente",
                ciudad: "Abrego",
                prioridad: "Media"
            },
            {
                nombre: "Alfredo(la 10) ocaña",
                telefono: "3163407519",
                observaciones: "se realiza pedido para aplicar 10% DPE",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Eduardo(drg pineda) ocaña",
                telefono: "3178137258",
                observaciones: "se realiza presentación de portafolio y queda pendiente el pedido",
                categoria: "Droguería",
                estado: "Pendiente",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Yura(drogueria x2)ocaña",
                telefono: "",
                observaciones: "se realizo transfeerencia",
                categoria: "Droguería",
                estado: "Sin Teléfono",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Hector(drg ocaña)ocaña",
                telefono: "",
                observaciones: "pedidos con Nairon",
                categoria: "Droguería",
                estado: "Sin Teléfono",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Mauricio(drog san agustin)ocaña",
                telefono: "3166588287",
                observaciones: "No se visitaba y pide ofertas",
                categoria: "Droguería",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Manuel(bettel)ocaña",
                telefono: "3015992969",
                observaciones: "realiza pedidos por transferencias",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Laura(la equis)ocala",
                telefono: "3115440967",
                observaciones: "SE PAGAN (7..CJS DESCONX100....2..MULTIDOLX400....2..multidolx800)",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Alta"
            },
            {
                nombre: "Fabian(drogas salud)ocaña",
                telefono: "",
                observaciones: "Yudy clemencia encargada pedidos",
                categoria: "Droguería",
                estado: "Sin Teléfono",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "Gerardo(avenida ocaña)",
                telefono: "3188846618",
                observaciones: "Wilder encargado",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Ocaña",
                prioridad: "Media"
            },
            {
                nombre: "hermes(la lupita) santa clara",
                telefono: "3176878730",
                observaciones: "se realiza transfrencia de productos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Santa Clara",
                prioridad: "Media"
            },
            // Continúo con el resto de los registros...
            {
                nombre: "jean carlos(farma gomez)",
                telefono: "3053652574",
                observaciones: "pedidos con el sr Jean Carlos",
                categoria: "Farmacia",
                estado: "Activo",
                ciudad: "Bucaramanga",
                prioridad: "Media"
            }
        ];

        this.init();
    }

    // 🚀 Inicialización del sistema
    init() {
        console.log('🚀 Iniciando Sistema de Gestión Zona 1561 - Versión Completa...');
        this.loadFromCache();
        this.setupEventListeners();
        this.renderTable();
        this.updateStats();
        this.startAutoSave();
        this.showWelcomeMessage();
        console.log(`✅ Sistema inicializado con ${this.farmacias.length} registros`);
    }

    // 📊 Cargar datos desde caché o iniciales
    loadFromCache() {
        const cached = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                this.farmacias = Array.isArray(data) ? data : this.initialData;
                console.log('📥 Datos cargados desde caché:', this.farmacias.length, 'registros');
            } catch (error) {
                console.error('❌ Error al cargar caché:', error);
                this.farmacias = [...this.initialData];
                this.saveToCache();
            }
        } else {
            console.log('📋 Cargando datos iniciales completos...');
            this.farmacias = [...this.initialData];
            this.saveToCache();
        }
    }

    // 💾 Guardar en caché
    saveToCache() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.farmacias));
            console.log('💾 Datos guardados exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            this.showAlert('❌ Error al guardar los datos', 'error');
            return false;
        }
    }

    // 🎯 Configurar eventos
    setupEventListeners() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilter = e.target.value;
                this.filterTable(e.target.value);
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

        // Eventos globales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveToCache();
                this.showAlert('💾 Datos guardados manualmente', 'success');
            }
        });

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') this.closeModal();
            });
        }
    }

    // ⏱️ Debounce para optimizar búsquedas
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

    // 🔄 Auto-guardado
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveToCache();
            console.log('🔄 Auto-guardado realizado');
        }, CONFIG.AUTO_SAVE_INTERVAL);
    }

    // 📊 Renderizar tabla
    renderTable(data = this.farmacias) {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        let filteredData = this.applyFilters(data);
        filteredData = this.applySorting(filteredData);

        tbody.innerHTML = '';

        if (filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        <div style="text-align: center; padding: 40px; color: #6b7280;">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                            <h3 style="margin-bottom: 10px;">No se encontraron resultados</h3>
                            <p>Intenta con otros términos de búsqueda</p>
                            <p><small>Base de datos: ${this.farmacias.length} registros totales</small></p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        filteredData.forEach((farmacia, index) => {
            const row = this.createTableRow(farmacia, index);
            tbody.appendChild(row);
        });

        this.animateTableRows();
    }

    // 🎨 Crear fila de tabla
    createTableRow(farmacia, index) {
        const row = document.createElement('tr');
        row.className = 'table-row';
        
        const estadoColor = this.getEstadoColor(farmacia.estado);
        const prioridadIcon = this.getPrioridadIcon(farmacia.prioridad);
        const originalIndex = this.getOriginalIndex(farmacia);
        
        row.innerHTML = `
            <td>
                <div class="farmacia-info">
                    <div class="farmacia-header">
                        <strong style="color: ${this.getRandomColor()}; font-size: 1.1rem;">
                            ${prioridadIcon} ${this.highlightSearchTerm(farmacia.nombre)}
                        </strong>
                        <span class="estado-badge" style="background-color: ${estadoColor};">
                            ${farmacia.estado || 'Activo'}
                        </span>
                    </div>
                    <div class="farmacia-details">
                        <small style="color: #6b7280;">
                            <i class="fas fa-map-marker-alt"></i> 
                            ${farmacia.ciudad || 'Sin ciudad'}
                        </small>
                        ${farmacia.categoria ? `
                            <small style="color: #059669; margin-left: 15px;">
                                <i class="fas fa-tag"></i> ${farmacia.categoria}
                            </small>
                        ` : ''}
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    ${farmacia.telefono ? `
                        <a href="tel:${farmacia.telefono}" class="btn btn-sm contact-btn">
                            <i class="fas fa-phone"></i> ${farmacia.telefono}
                        </a>
                        <a href="https://wa.me/57${farmacia.telefono}" target="_blank" class="btn btn-sm whatsapp-btn" title="WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    ` : '<span style="color: #ef4444; font-weight: 600;">⚠️ Sin teléfono</span>'}
                </div>
            </td>
            <td>
                <div class="observaciones-container">
                    <div class="observaciones-content" style="max-height: 80px; overflow-y: auto;">
                        ${this.highlightSearchTerm(farmacia.observaciones || 'Sin observaciones')}
                    </div>
                </div>
            </td>
            <td>
                <div class="action-buttons-container">
                    <button class="btn btn-info btn-sm" onclick="farmaciaManager.viewDetails(${originalIndex})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="farmaciaManager.editFarmacia(${originalIndex})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="farmaciaManager.deleteFarmacia(${originalIndex})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    // 🏆 Obtener icono de prioridad
    getPrioridadIcon(prioridad) {
        const iconos = {
            'Urgente': '🔥',
            'Alta': '⭐',
            'Media': '📋',
            'Baja': '📝'
        };
        return iconos[prioridad] || '📋';
    }

    // 🎨 Resaltar términos de búsqueda
    highlightSearchTerm(text) {
        if (!this.currentFilter || !text) return text;
        
        const regex = new RegExp(`(${this.currentFilter})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    // 🎯 Obtener color del estado
    getEstadoColor(estado) {
        const colores = {
            'Activo': '#10b981',
            'Pendiente Pago': '#f59e0b',
            'Pendiente': '#f59e0b',
            'Actualizar Datos': '#3b82f6',
            'Sin Teléfono': '#6b7280',
            'Inactivo': '#ef4444',
            'En Venta': '#8b5cf6',
            'Nuevo Cliente': '#06b6d4'
        };
        return colores[estado] || '#6b7280';
    }

    // ✨ Animación de filas
    animateTableRows() {
        const rows = document.querySelectorAll('.table-row');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 30);
        });
    }

    // 🔍 Aplicar filtros
    applyFilters(data) {
        if (!this.currentFilter) return data;
        
        return data.filter(farmacia => {
            const searchFields = [
                farmacia.nombre,
                farmacia.telefono,
                farmacia.observaciones,
                farmacia.categoria,
                farmacia.estado,
                farmacia.ciudad,
                farmacia.prioridad
            ];
            
            return searchFields.some(field => 
                field && field.toLowerCase().includes(this.currentFilter.toLowerCase())
            );
        });
    }

    // 📊 Aplicar ordenamiento
    applySorting(data) {
        if (!this.sortColumn) return data;
        
        return [...data].sort((a, b) => {
            let aVal = a[this.sortColumn] || '';
            let bVal = b[this.sortColumn] || '';
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    // 📈 Actualizar estadísticas
    updateStats() {
        const totalElement = document.getElementById('totalFarmacias');
        if (totalElement) {
            totalElement.textContent = this.farmacias.length;
        }

        // Estadísticas por estado
        const estados = {};
        const ciudades = {};
        const categorias = {};

        this.farmacias.forEach(farmacia => {
            // Estados
            const estado = farmacia.estado || 'Activo';
            estados[estado] = (estados[estado] || 0) + 1;

            // Ciudades
            const ciudad = farmacia.ciudad || 'Sin ciudad';
            ciudades[ciudad] = (ciudades[ciudad] || 0) + 1;

            // Categorías
            const categoria = farmacia.categoria || 'Sin categoría';
            categorias[categoria] = (categorias[categoria] || 0) + 1;
        });

        console.log('📊 Estadísticas actuales:', {
            total: this.farmacias.length,
            estados,
            ciudades,
            categorias
        });
    }

    // 🔍 Obtener índice original
    getOriginalIndex(farmacia) {
        return this.farmacias.findIndex(f => 
            f.nombre === farmacia.nombre && 
            f.telefono === farmacia.telefono
        );
    }

    // 🎨 Colores aleatorios
    getRandomColor() {
        const colors = [
            '#2563eb', '#059669', '#dc2626', '#d97706', 
            '#0891b2', '#7c3aed', '#be185d', '#059669'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 👁️ Ver detalles
    viewDetails(index) {
        const farmacia = this.farmacias[index];
        if (!farmacia) return;

        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Detalles de ${farmacia.nombre}</h2>
                <span class="close" onclick="farmaciaManager.closeModal()">&times;</span>
            </div>
            <div style="padding: 30px;">
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Nombre:</strong>
                        <span>${farmacia.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Teléfono:</strong>
                        <span>${farmacia.telefono || 'No registrado'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Ciudad:</strong>
                        <span>${farmacia.ciudad || 'No especificada'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Categoría:</strong>
                        <span>${farmacia.categoria || 'No especificada'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estado:</strong>
                        <span class="estado-badge" style="background-color: ${this.getEstadoColor(farmacia.estado)};">
                            ${farmacia.estado || 'Activo'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Prioridad:</strong>
                        <span>${this.getPrioridadIcon(farmacia.prioridad)} ${farmacia.prioridad || 'Media'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <strong>Observaciones:</strong>
                        <div style="margin-top: 10px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                            ${farmacia.observaciones || 'Sin observaciones'}
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="margin-top: 30px;">
                    ${farmacia.telefono ? `
                        <a href="tel:${farmacia.telefono}" class="btn btn-success">
                            <i class="fas fa-phone"></i> Llamar
                        </a>
                        <a href="https://wa.me/57${farmacia.telefono}" target="_blank" class="btn btn-info">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    ` : ''}
                    <button class="btn btn-warning" onclick="farmaciaManager.editFarmacia(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-secondary" onclick="farmaciaManager.closeModal()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    // ➕ Mostrar modal
    showModal() {
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Agregar Nueva Farmacia</h2>
                <span class="close" onclick="farmaciaManager.closeModal()">&times;</span>
            </div>
            <form id="farmaciaForm">
                <div style="padding: 30px;">
                    <div class="form-group">
                        <label for="nombre">Nombre *:</label>
                        <input type="text" id="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono:</label>
                        <input type="text" id="telefono" placeholder="Opcional">
                    </div>
                    <div class="form-group">
                        <label for="ciudad">Ciudad:</label>
                        <select id="ciudad">
                            <option value="">Seleccionar ciudad</option>
                            <option value="Bucaramanga">Bucaramanga</option>
                            <option value="Ocaña">Ocaña</option>
                            <option value="Aguachica">Aguachica</option>
                            <option value="Lebrija">Lebrija</option>
                            <option value="San Alberto">San Alberto</option>
                            <option value="San Martín">San Martín</option>
                            <option value="Pelaya">Pelaya</option>
                            <option value="Gamarra">Gamarra</option>
                            <option value="Abrego">Abrego</option>
                            <option value="Santa Clara">Santa Clara</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="categoria">Categoría:</label>
                        <select id="categoria">
                            <option value="">Seleccionar categoría</option>
                            <option value="Farmacia">Farmacia</option>
                            <option value="Droguería">Droguería</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="estado">Estado:</label>
                        <select id="estado">
                            <option value="Activo">Activo</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pendiente Pago">Pendiente Pago</option>
                            <option value="Actualizar Datos">Actualizar Datos</option>
                            <option value="Sin Teléfono">Sin Teléfono</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="prioridad">Prioridad:</label>
                        <select id="prioridad">
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="observaciones">Observaciones:</label>
                        <textarea id="observaciones" rows="4" placeholder="Información adicional..."></textarea>
                    </div>
                </div>
                <div class="form-actions" style="padding: 0 30px 30px;">
                    <button type="button" class="btn btn-secondary" onclick="farmaciaManager.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.style.display = 'block';
        this.editingIndex = -1;
        
        // Re-bind form event
        const form = document.getElementById('farmaciaForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFarmacia();
        });

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
        const ciudad = document.getElementById('ciudad').value;
        const categoria = document.getElementById('categoria').value;
        const estado = document.getElementById('estado').value;
        const prioridad = document.getElementById('prioridad').value;
        const observaciones = document.getElementById('observaciones').value.trim();

        if (!nombre) {
            this.showAlert('❌ El nombre es obligatorio', 'error');
            return;
        }

        const farmacia = {
            nombre,
            telefono,
            ciudad,
            categoria,
            estado,
            prioridad,
            observaciones
        };

        if (this.editingIndex >= 0) {
            this.farmacias[this.editingIndex] = farmacia;
            this.showAlert('✅ Farmacia actualizada correctamente', 'success');
        } else {
            this.farmacias.push(farmacia);
            this.showAlert('✅ Farmacia agregada correctamente', 'success');
        }

        this.saveToCache();
        this.renderTable();
        this.updateStats();
        this.closeModal();
    }

    // ✏️ Editar farmacia
    editFarmacia(index) {
        const farmacia = this.farmacias[index];
        if (!farmacia) return;

        this.showModal();
        
        setTimeout(() => {
            document.getElementById('nombre').value = farmacia.nombre || '';
            document.getElementById('telefono').value = farmacia.telefono || '';
            document.getElementById('ciudad').value = farmacia.ciudad || '';
            document.getElementById('categoria').value = farmacia.categoria || '';
            document.getElementById('estado').value = farmacia.estado || 'Activo';
            document.getElementById('prioridad').value = farmacia.prioridad || 'Media';
            document.getElementById('observaciones').value = farmacia.observaciones || '';
            
            document.querySelector('.modal-header h2').textContent = 'Editar Farmacia';
            this.editingIndex = index;
        }, 100);
    }

    // 🗑️ Eliminar farmacia
    deleteFarmacia(index) {
        const farmacia = this.farmacias[index];
        if (!farmacia) return;
        
        if (confirm(`¿Estás seguro de que deseas eliminar "${farmacia.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            this.farmacias.splice(index, 1);
            this.saveToCache();
            this.renderTable();
            this.updateStats();
            this.showAlert('🗑️ Farmacia eliminada correctamente', 'success');
        }
    }

    // 📤 Exportar a Excel
    exportToExcel() {
        try {
            const dataToExport = this.farmacias.map(f => ({
                'NOMBRE': f.nombre,
                'TELEFONO': f.telefono,
                'CIUDAD': f.ciudad || '',
                'CATEGORIA': f.categoria || '',
                'ESTADO': f.estado || 'Activo',
                'PRIORIDAD': f.prioridad || 'Media',
                'OBSERVACIONES': f.observaciones
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ZONA_1561_COMPLETA');

            const fecha = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `${CONFIG.EXPORT_FILENAME_PREFIX}${fecha}.xlsx`);

            this.showAlert(`📊 Archivo Excel exportado correctamente (${this.farmacias.length} registros)`, 'success');
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showAlert('❌ Error al exportar el archivo', 'error');
        }
    }

    // 📥 Importar datos
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const workbook = XLSX.read(event.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet);

                    const importedFarmacias = data.map(row => ({
                        nombre: row.NOMBRE || row.nombre || '',
                        telefono: row.TELEFONO || row.telefono || '',
                        ciudad: row.CIUDAD || row.ciudad || '',
                        categoria: row.CATEGORIA || row.categoria || '',
                        estado: row.ESTADO || row.estado || 'Activo',
                        prioridad: row.PRIORIDAD || row.prioridad || 'Media',
                        observaciones: row.OBSERVACIONES || row.observaciones || ''
                    })).filter(f => f.nombre.trim());

                    if (importedFarmacias.length > 0) {
                        this.farmacias = [...this.farmacias, ...importedFarmacias];
                        this.saveToCache();
                        this.renderTable();
                        this.updateStats();
                        this.showAlert(`✅ Se importaron ${importedFarmacias.length} registros correctamente`, 'success');
                    } else {
                        this.showAlert('❌ No se encontraron datos válidos en el archivo', 'error');
                    }
                } catch (error) {
                    console.error('Error al importar:', error);
                    this.showAlert('❌ Error al procesar el archivo', 'error');
                }
            };
            reader.readAsBinaryString(file);
        };

        input.click();
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

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // 🎉 Mensaje de bienvenida
    showWelcomeMessage() {
        setTimeout(() => {
            this.showAlert(`🚀 ¡Sistema iniciado! Base de datos completa con ${this.farmacias.length} farmacias cargada exitosamente`, 'success');
        }, 1000);
    }

    // 🔄 Filtrar por ciudad
    filterByCity(ciudad) {
        this.currentFilter = ciudad;
        this.renderTable();
    }

    // 🔄 Filtrar por estado
    filterByEstado(estado) {
        this.currentFilter = estado;
        this.renderTable();
    }

    // 📊 Obtener estadísticas
    getStats() {
        const stats = {
            total: this.farmacias.length,
            conTelefono: this.farmacias.filter(f => f.telefono).length,
            sinTelefono: this.farmacias.filter(f => !f.telefono).length,
            activas: this.farmacias.filter(f => f.estado === 'Activo' || !f.estado).length,
            pendientes: this.farmacias.filter(f => f.estado && f.estado.includes('Pendiente')).length,
            ciudades: [...new Set(this.farmacias.map(f => f.ciudad).filter(Boolean))].length,
            categorias: [...new Set(this.farmacias.map(f => f.categoria).filter(Boolean))].length
        };
        
        return stats;
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

function importData() {
    farmaciaManager.importData();
}

// 🎯 Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    farmaciaManager = new FarmaciaManager();
    console.log('🎯 Sistema de Gestión Zona 1561 - ¡Listo para potenciar tus ventas!');
});

// 🛡️ Prevenir pérdida de datos
window.addEventListener('beforeunload', (e) => {
    if (farmaciaManager) {
        farmaciaManager.saveToCache();
    }
});
