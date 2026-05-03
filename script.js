const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/"
};

if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);

    const db = firebase.database();
    const onlineRef = db.ref("visitantes_online");

    const userRef = onlineRef.push();

    // conexão real
    db.ref(".info/connected").on("value", (snap) => {
        if (snap.val() === true) {
            userRef.set(true);
            userRef.onDisconnect().remove();
        }
    });

    // contador real
    onlineRef.on("value", (snap) => {
        const total = snap.numChildren();
        const el = document.getElementById("pessoal-online");

        if (el) {
            el.innerText = total > 0 ? total : 1;
        }
    });

} else {
    console.log("Firebase não carregado");
}