"use strict";
const BASE = 80, MIN = 7680, MAX = MIN+BASE-1;
function encode36(n) {
    n += 36*36;
    return n.toString(36);
}
function decode36(s) {
    return Number.parseInt(s, 36)-36*36;
}
function encodeLine(s) {
    const sa = s.split(" ");
    var v = "";
    for (var j=0; j<sa.length; j++) {
        const cv = sa[j].split(":");
        const i = indexOf(Number(cv[0]), Number(cv[1]));
        v += encode36(i);
    }
    return v;
}
function decodeLine(s) {
    var v = "";
    for (var j=0; j<s.length; j+=3) {
        const c = s.substring(j, j+3);
        const cv = toCV(decode36(c));
        v += cv[0]+":"+cv[1]+" ";
    }
    return v;
}
function charCode(i) {
    return String.fromCharCode(MIN + i);
}
function indexOf(c, v) {
    return last[c-1]+v;
}
function pageOf(c, v) {
    const i = indexOf(c, v);
    var p = Math.trunc(i*nPage/nVerse);
    if (i == index[p]) return p;
    while (i < index[p]) p--;
    while (i > index[p+1]) p++;
    return p;
}
function toChapter(i) {
    for (var c=1; c<=nChap; c++)
        if (i <= last[c]) return c;
}
function toCV(i) {
    const c = toChapter(i);
    return [c, i - last[c-1]];
}
const last = [0,7,293,493,669,789,954,1160,1235,1364,
    1473,1596,1707,1750,1802,1901,2029,2140,2250,2348,2483,
    2595,2673,2791,2855,2932,3159,3252,3340,3409,3469,3503,
    3533,3606,3660,3705,3788,3970,4058,4133,4218,4272,4325,
    4414,4473,4510,4545,4583,4612,4630,4675,4735,4784,4846,
    4901,4979,5075,5104,5126,5150,5163,5177,5188,5199,5217,
    5229,5241,5271,5323,5375,5419,5447,5475,5495,5551,5591,
    5622,5672,5712,5758,5800,5829,5848,5884,5909,5931,5948,
    5967,5993,6023,6043,6058,6079,6090,6098,6106,6125,6130,
    6138,6146,6157,6168,6176,6179,6188,6193,6197,6204,6207,
    6213,6216,6221,6225,6230,6236];
const nChap = last.length-1, nVerse = last[nChap];
var index, nPage, sName, pLabel = [];
function init() {
  console.log(nChap+" suras -> "+nVerse);
  const count = [7,5,11,8,5,8,11,9,4,8,7,7,5,5,8,4,7,7,7,8,7,4,8,10,6,
    7,5,5,4,6,6,8,5,4,5,6,3,4,8,3,4,4,3,5,5,5,7,1,4,9,6,7,7,8,8,7,9,9,
    7,6,8,9,8,7,6,11,8,8,5,4,8,8,7,6,8,6,6,5,3,5,4,3,7,4,7,7,8,6,9,5,
    7,5,3,7,4,8,8,6,7,6,7,7,8,8,5,3,3,4,4,4,6,8,5,5,4,5,7,7,6,6,6,7,6,
    8,5,5,7,8,10,9,8,9,8,7,9,5,8,9,4,7,9,8,6,7,6,5,4,5,6,8,11,11,8,7,
    6,8,6,10,6,8,6,8,9,15,11,7,6,6,6,4,4,7,8,9,8,11,8,8,9,8,7,5,7,9,8,
    6,6,7,7,6,5,5,4,7,7,7,7,4,7,7,7,6,7,5,6,5,7,6,8,6,5,8,9,11,8,9,8,
    10,9,9,8,7,7,9,9,8,8,9,9,10,7,9,11,9,10,10,8,8,7,6,9,11,6,9,8,9,8,
    8,5,8,5,10,6,8,6,5,8,5,10,9,10,15,16,20,19,19,16,8,12,8,8,11,11,8,
    7,8,6,9,8,8,10,7,10,10,11,11,9,8,9,11,10,8,11,11,5,7,7,11,8,8,13,9,
    14,13,11,14,13,13,13,12,19,15,25,14,13,12,11,11,15,12,10,10,14,
    11,9,12,16,9,9,11,11,5,10,8,7,8,8,9,9,8,6,17,10,15,19,13,15,15,
    14,10,10,7,4,5,7,10,5,3,5,9,9,12,11,12,12,10,19,20,21,23,28,25,
    23,24,21,23,13,8,14,9,11,8,13,12,9,9,8,7,7,8,7,9,11,7,7,10,8,9,7,
    8,7,7,11,11,10,9,8,9,9,10,11,8,9,6,11,9,10,6,9,7,8,5,8,7,4,8,11,6,
    8,8,9,8,9,9,8,7,12,8,6,13,15,13,14,16,13,24,26,26,26,24,27,29,16,
    10,16,19,22,10,5,11,10,9,7,9,11,7,8,9,9,8,7,9,9,8,11,8,11,9,9,9,8,
    8,10,5,7,9,13,7,12,12,10,15,13,13,16,18,20,21,13,9,10,10,9,6,8,7,
    11,8,10,9,9,6,8,5,5,7,7,15,20,16,24,21,23,17,18,26,18,24,21,22,22,
    24,27,27,34,26,23,8,7,6,5,6,5,10,4,6,7,8,5,6,7,9,8,7,7,9,9,5,7,7,
    5,12,14,19,26,19,26,28,29,16,17,13,15,19,18,30,28,26,20,25,31,30,
    24,32,42,29,19,36,25,22,36,26,30,20,36,19,27,13,19,19,17,14,14,15];
  nPage = count.length;
  index = new Array(nPage+1); index[0] = 0;
  for (var i=0; i<nPage; i++) index[i+1] = index[i] + count[i];
  console.log(nPage+" pages -> "+index[nPage]);
  const suraNames = `
Fatiha
Bakara
Ali İmran
Nisa
Maide
Enam
Araf
Enfal
Tevbe
Yunus
Hud
Yusuf
Rad
İbrahim
Hicr
Nahl
İsra
Kehf
Meryem
Taha
Enbiya
Hacc
Muminun
Nur
Furkan
Şuara
Neml
Kasas
Ankebut
Rum
Lokman
Secde
Ahzab
Sebe
Fatır
Yasin
Saffat
Sad
Zümer
Mümin
Fussilet
Şura
Zuhruf
Duhan
Casiye
Ahkaf
Muhammed
Fetih
Hucurat
Kaf
Zariyat
Tur
Necm
Kamer
Rahman
Vakıa
Hadid
Mücadele
Haşr
Mümtahine
Saff
Cuma
Münafıkun
Tegabun
Talak
Tahrim
Mülk
Kalem
Hakka
Mearic
Nuh
Cinn
Müzzemmil
Müddessir
Kıyamet
İnsan
Mürselat
Nebe
Naziat
Abese
Tekvir
İnfitar
Mutaffifin
İnşikak
Buruc
Tarık
Ala
Gaşiye
Fecr
Beled
Şems
Leyl
Duha
İnşirah
Tin
Alak
Kadir
Beyyine
Zilzal
Adiyat
Karia
Tekasur
Asr
Hümeze
Fil
Kureyş
Maun
Kevser
Kafirun
Nasr
Leheb
İhlas
Felak
Nas`;
    sName = suraNames.split("\n");
    for (let p=0; p<=nPage; p++) {
        let [c, v] = toCV(index[p]+1);
        pLabel.push(sName[c]+" "+v+ ", p."+p)
    }
}
init()

