const {
    userInfo,
    sendTextMessage,
    sendQuickReplies,
    sendGenericTemplate,
    sendLocationButton,
    sendOffer,
    sendOffers,
    sendOffersList
} = require('./messenger');

let count = 0;

module.exports = async (id, data, type) => {
    console.log('Conversation');

    if (type === 'message') {
        console.log('📦  TYPE: message');
        // console.log('📦', data);
        for (let i = 0; i < data.length; i += 1) {
            const event = data[i];
            const sender = event.sender.id;

            if (event.message && event.message.text) {
                let text = event.message.text
                console.log('Text: ', text);

                let fuel = [{
                        name: 'G-Drive',
                        shortDescription: "Novi premijum benzin 100 oktana G-Drive 100 sadrži aktivne komponente koje omogućavaju efikasniji rad motora, poboljšavaju njegove performanse i pozitivno se odražavaju na njegovu ispravnost i dugovečnost. Proizvedeno prema najvišim tehnološkim standardima, G-Drive 100 je gorivo nove snage koje će vašem motoru pružiti profesionalnu zaštitu, a vama sigurniju i uzbudljiviju vožnju. Specijalna formula ovog goriva produžava radni vek motora i sprečava nastanak kvarova. ",
                        image_url: "https://www.nis.eu/wp-content/uploads/2014/10/gdrive.png"
                    },
                    {
                        name: 'EVRO BMB 98',
                        shortDescription: "Opis",
                        image_url: "https://www.nis.eu/wp-content/uploads/2014/10/nis_piu_logo_bmb98.png"
                    },
                    {
                        name: 'EVRO Dizel',
                        shortDescription: "Naš evrodizel vrhunskog kvaliteta omogućava maksimalne performanse vozila, pravilno paljenje i besprekoran rad motora čak i na izuzetno niskim temperaturama. Mirniji rad, veća snaga i manja potrošnja jesu prednosti korišćenja ovog goriva. Proizveden po najstrožim proizvođačkim specifikacijama, kvalitet evrodizela je potpuno u skladu sa evropskim standardom EN 590.",
                        image_url: "https://www.nis.eu/wp-content/uploads/2014/10/nis_piu_logo_dizel.png"
                    },
                    {
                        name: 'AUTOGAS TNG',
                        shortDescription: "TNG auto-gas prilagođen je uređajima za gas novije generacije. Ekonomičnost auto-gasa ogleda se u niskoj ceni, dužem veku trajanja motora, nižim troškovima održavanja vozila, dužem periodu zamene ulja i svećica, dužem veku trajanja katalizatora. Sa ekološkog aspekta, znatno je povoljniji od klasičnih motornih goriva. Proizveden po najstrožim proizvođačkim specifikacijama, kvalitet auto-gasa TNG potpuno je u skladu sa evropskim standardom EN 589.",
                        image_url: "https://www.nis.eu/wp-content/uploads/2014/10/nis_piu_logo_tng.png"
                    }
                ];

                if (text === 'restart') {
                    count = 0;
                    return;
                }
                console.log(count);
                switch (count) {
                    case 0:
                        await sendGenericTemplate(sender, 'Dobrodosli u Nis chatbot ✋', 'http://www.romania-insider.com/wp-content/uploads/2012/07/NIS-gazprom1.jpg', 'title', 'subtitle')
                        await sendLocationButton(sender);
                        count++
                        break;
                    case 1:
                        break;
                    case 2:
                        if (text === 'Cena goriva') {
                            await sendOffers(sender, fuel);
                            count = 3;
                        } else if (text === 'Najbliza pumpa') {
                            await sendGenericTemplate(sender, 'NIS Petrlo Beograd', 'https://banjalucanke.com/wp-content/uploads/2014/08/nis-petrol.jpg', 'NIS Petro Beograd', 'Udaljenost 7.4km ')
                            count = 4;
                        } else if (text === 'Ponude') {
                            count = 5;
                        }
                        break;
                    case 3:
                        break;
                    case 4:

                        break;
                    case 5:

                        break;



                    default:
                        break;
                }



                // await sendTextMessage(sender, [`HACKATON1: ${text}`]);
                // await sendGenericTemplate(sender,  'text', 'http://www.romania-insider.com/wp-content/uploads/2012/07/NIS-gazprom1.jpg', 'title', 'subtitle')

                // console.log('Sender', sender);
                // const offers = [{
                //         name: 'Ponuda1',
                //         shortDescription: "Opis",
                //         image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                //     },
                //     {
                //         name: 'Ponuda2',
                //         shortDescription: "Opis",
                //         image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                //     },
                //     {
                //         name: 'Ponuda3',
                //         shortDescription: "Opis",
                //         image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                //     }
                // ];

                // await sendOffer(sender, {
                //     name: 'Ponuda',
                //     shortDescription: "Opis",
                //     image_url: "https://gordanladdskitchen.com/wp-content/uploads/2017/06/best-latte-machine.jpeg"
                // });


                // await sendOffers(
                //     sender,
                //     offers,
                //     // ['1', '2']
                // );


                // await sendOffersList(
                //     sender,
                //     offers, ['1', '2']
                // );


                // Logic
            } else if (event.postback && event.postback.payload) {
                console.log('Postback or payload');
                const {
                    postback
                } = event;
                const {
                    payload
                } = postback;
                console.log(postback, payload);

                if (payload === 'about') {
                    await sendTextMessage(sender, ['Industrija nafte i gasa je energetski intezivna industrija i zato su energetska efikasnost i energetske uštede u svim poslovnim oblastima Kompanije veoma značajni za uspešno poslovanje NIS-a u celini. <3']);
                } else if (payload.indexOf('gorivo') !== -1) {
                    const i = parseInt(payload[0]);
                    console.log(i);
                    await sendTextMessage(sender, [`Izabrali ste ${fuel[i].name}`]);
                    await sendGenericTemplate(sender, `${fuel[i].name}`, `${fuel[i].image_url}`, `${fuel[i].shortDescription}`, `${fuel[i].name}`);


                }

                console.log(await userInfo(sender));
            } else if (event.message && event.message.mid && event.message.attachments && event.message.seq) {
                // console.log(event);
                await sendQuickReplies(sender, 'Izaberi:', ['Cena goriva', 'Najbliza pumpa', 'Ponude']);
                count++;
            }
        }
    } else {
        console.log('Not type message');
    }
}