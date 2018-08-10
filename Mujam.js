"use strict";
const VERSION = "V1.0";
var sajda;  //global array
const letterToRoots = new Map();
const rootToWords = new Map();
const wordToRefs = new Map();
//const wordToRoot = new Map();

function parseRefs(str) {
    let page = [], refA = [], prev = -1;
    for (let j=0; j<str.length; j+=3) {
        let code = str.substring(j, j+3);
        let idx = decode36(code);
        let [c, v] = toCV(idx);
        let cv = c+":"+v;
        let p = pageOf(c, v);
        if (prev == p)
            cv = refA.pop()+" "+cv;
        else { page.push(p); prev = p }
        refA.push(cv);
    }
    page.push(999); //999 is sentinel
    return [page, refA];
}
function report1(t) {
    let line = t.split("\n"), m = line.length-1;
    console.log(t.length+" chars "+m+" lines");
    for (let i = 0; i < m; i++) {
      let s = line[i];
      let k = s.indexOf("\t");
      if (k < 0) throw Error("TAB missing "+s);
      wordToRefs.set(s.substring(0, k), s.substring(k+1));
    }
    let str = "1w82bu2i62ne2s430l38z3gg3pq42y4a74qm5k15q5";
    [sajda, ] = parseRefs(str);
    /*
      let h = window.location.hash.substring(1);
      if (h.length > 0) menu3.value = h;
      console.log("Hash: "+h);
    */
    makeMenu(menu3, [...wordToRefs.keys()]); 
    selectWord();
}
function report2(t) {
  let words = [];
  function addRefs(s, k) {
    let w = s.substring(0, k); words.push(w);
    wordToRefs.set(w, s.substring(k+1));
    return w;
  }
    wordToRefs.clear();
    let line = t.split("\n"), m = line.length-1;
    console.log(t.length+" chars "+m+" lines");
    let i = 0; 
    while (i < m) {
      let root = line[i]; words = [];
      let j = i+1;
      while (j < m) {
          let word = line[j];
          let k = word.indexOf("\t");
          if (k <= 0) break; 
          else word = addRefs(word, k);
          //wordToRoot.set(word, root); 
          j++;
      }
      i = j; words.sort();
      let ch = root[0];
      //if (ch == "ء") continue; //skip hamza
      let x = letterToRoots.get(ch);
      if (x) x.push(root);
      else letterToRoots.set(ch, [root]);
      rootToWords.set(root, words);
    }
    let keys = [...letterToRoots.keys()];
    makeMenu(menu1, keys.sort());
    selectLetter("س"); selectRoot("سجد 92");
}
function readData() {
    out.innerText = "Reading data";
    const site = "https://maeyler.github.io/Visual-Mujam/";
    const url = site+"data.txt";
    fetch(url)
      .then(r => r.text())  //response
      .then(t => report2(t));  //text
}
function makeMenu(m, a) {
    m.innerHTML = "<option selected>"+a.join("<option>");
}
function selectLetter(ch) {
    if (!ch) ch = menu1.value;
    else menu1.value = ch; 
    //console.log("selectLetter: "+ch);
    makeMenu(menu2, letterToRoots.get(ch)); 
    selectRoot();
}
function selectRoot(root) {
    if (!root) root = menu2.value;
    else menu2.value = root;
    //console.log("selectRoot: "+root);
    let words = rootToWords.get(root);
    //menu3.disabled = (words.length == 1);
    menu3.style.color= (words.length == 1? "gray" : "");
    makeMenu(menu3, words); selectWord();
}
function selectWord(word) {
    if (!word) word = menu3.value;
    //else menu3.value = word;
    //console.log("selectWord: "+word);
    makeTable(word);
}
function makeTable(word) {
    displayRef(word, wordToRefs.get(word));
}
function displayRef(word, str) {
  function threeDigits(k) {
    let s = ""+k; 
    while (s.length < 3) s = "0"+s;
    return s;
  }
    let [page, ref] = parseRefs(str);
    const m=30, n=20;
    let row = "<th>Juzz</th><th>Page</th>";
    for (let j = 1; j <= n; j++) {
        let s;
        if (j > 9) s = ""+j;
        else s = "0"+j;
        row += "<th>+"+s+"</th>";
    }
    let text = "<tr>"+row+"</tr>";
    let pn=0, p=0, q=0, nc=0;
    for (let i = 1; i <= m; i++) {
        //let pn = 20*(i-1);
        row = "<th>"+i+"</th><th>"+threeDigits(pn)+"</th>";
        for (let j = 1; j <= n; j++) {
            pn++; //page number
            let s1 = "", s2 = ""; //s1 is visible, s2 is hidden
            if (pn == page[p]) {
                let c = ref[p].split(" ").length;
                s1 = " "+c;
                let k = ref[p].indexOf(":");
                k = (k<0? 0 : Number(ref[p].substring(0, k)));
                s2 = "<span class='t2'>"+sName[k]+" "+ref[p]+"</span>";
                p++; nc += c;
            } else {
                s2 = "<span class='t1'>"+pLabel[pn]+"</span>";
            }
            if (pn == sajda[q]) {
                s1 += " ۩"; q++;
            }
            row += "<td>"+s1+s2+"</td>";
        }
        text += "<tr>"+row+"</tr>";
    }
    tablo.innerHTML = text;
    document.title = TITLE+" -- "+word;
    menu3.value = word;
    text = " "+nc+" instances on "+ref.length+" pages"
    if (nc == 0) text = "(too many verses -- not shown)"
    out.innerText = text; console.log(text); 
    //window.location.hash = "#"+word;
}
function doClick1(e) {
    if (!e) e = window.event;
    let t = e.target;
    if (t.tagName.toLowerCase() != "td")
        t = t.parentElement;
    if (t.tagName.toLowerCase() != "td") return;
    const REF = "http://kuranmeali.com/Sayfalar.php?sayfa=";
    let r = t.parentElement.rowIndex;
    let p = (20*(r-1)+t.cellIndex-1);
    console.log("click on p"+p);
    window.open(REF+p, "text", "resizable,scrollbars", true);
}
function doClick2(t) {
    const REF = "http://corpus.quran.com/qurandictionary.jsp";
    let p = "", v = menu2.value;
    if (v) p = "?q="+toBuckwalter(v.split(" ")[0]);
    console.log("click on p"+p);
    window.open(REF+p, "corpus", "resizable,scrollbars", true);
}

