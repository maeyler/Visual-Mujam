"use strict";
const VERSION = "V1.5";
var sajda;  //global array
const MAX_REF = 100;
const letterToRoots = new Map();
const rootToWords = new Map();
const wordToRefs = new Map();

function addIndexes(str, indA) {
    for (let j=0; j<str.length; j+=3) {
        let code = str.substring(j, j+3);
        indA.push(decode36(code));
    }
}
function indexToArray(indA) {
    let page = [], refA = [], prev = -1;
    for (let i of indA) {
        let [c, v] = toCV(i);
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
function parseRefs(str) {
    let indA = []; addIndexes(str, indA);
    return indexToArray(indA)
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
  function convert(s) { //should be done in data.txt
    const EM_SPACE = String.fromCharCode(8195);
    return s.replace(" ", EM_SPACE); 
  }
    wordToRefs.clear();
    let line = t.split("\n"), m = line.length-1;
    console.log(t.length+" chars "+m+" lines");
    let i = 0; 
    while (i < m) {
      let root = convert(line[i]);
      let j = i+1, list = [];
      while (j < m) {
          let s = line[j], k = s.indexOf("\t");
          if (k <= 0) break; 
          let word = convert(s.substring(0, k));
          wordToRefs.set(word, s.substring(k+1));
          list.push(word); j++;
      }
      i = j; list.sort();
      let ch = root[0];
      let x = letterToRoots.get(ch);
      if (x) x.push(root);
      else letterToRoots.set(ch, [root]);
      rootToWords.set(root, list);
    }
    let keys = [...letterToRoots.keys()];
    makeMenu(menu1, keys.sort());
    selectLetter("س"); selectRoot(convert("سجد 92"));
}
function readData() {
    out.innerText = "Reading data";
    const site = "https://maeyler.github.io/Visual-Mujam/";
    const url = site+"data.txt";
    fetch(url)
      .then(r => r.text())  //response
      .then(t => report2(t));  //text
}
function makeMenu(m, a) { //first item is selected
    let OPT = "<option selected>";
    m.innerHTML = OPT+a.join("<option>");
}
function selectLetter(ch) {
    if (!ch) ch = menu1.value;
    else menu1.value = ch; 
    makeMenu(menu2, letterToRoots.get(ch)); 
    selectRoot();
}
function selectRoot(root) {
    if (!root) root = menu2.value;
    else menu2.value = root;
    let list = rootToWords.get(root);
    let nL = list.length;
    makeMenu(menu3, list);
    if (nL > 1)
      menu3.selectedIndex = -1; //do not select Word
    menu3.disabled = (nL == 1);
    menu3.style.color = (nL == 1? "gray" : "");
    //combine refs in list
    combine.hidden = true; let indA = [];
    for (let j=0; j<nL; j++) {
        let str = wordToRefs.get(list[j]);
        let nR = str.length/3;
        if (nR == 0) //too many refs -- not indexed
            menu3.children[j].disabled = true;
        else if (nL < 3*MAX_REF || nR < MAX_REF) 
            addIndexes(str, indA);
    }
    indA.sort((a, b) => (a-b));
    let [page, refs] = indexToArray(indA);
    displayRef(root, page, refs);
}
function selectWord(word) {
    if (!word) word = menu3.value;
    else menu3.value = word;
    combine.hidden = false;
    let str = wordToRefs.get(word);
    let [page, refA] = parseRefs(str);
    displayRef(word, page, refA);
}
function toColor(n) {
    if (n == 0) return "";
    let g = 255-16*n, b = 160-10*n;
    return "rgb("+g+", "+g+", "+b+")";
}
function displayRef(word, page, refA) {
  function threeDigits(k) {
  //same as (""+k).padStart(3,"0")
    let s = ""+k;  
    while (s.length < 3) s = "0"+s; 
    return s; 
  } 
    const m=30, n=20;
    let row = "<th>Page</th>"; //"<th>Juzz</th>";
    for (let j = 1; j <= n; j++) {
        let s;
        if (j > 9) s = ""+j;
        else s = "0"+j;
        row += "<th>"+s+"</th>";
    }
    let text = "<tr>"+row+"</tr>";
    let pn=0, p=0, q=0, nc=0;
    for (let i = 1; i <= m; i++) {
        // pn == 20*(i-1);   <th>"+i+"</th>
        let s2 = "<span class='t1'>Juzz "+i+"</span>"; //s2 is hidden
        row = "<th>"+threeDigits(pn)+s2+"</th>";
        for (let j = 1; j <= n; j++) {
            pn++; //page number
            let c = 0;
            if (pn == page[p]) {
                c = refA[p].split(" ").length;
                let k = refA[p].indexOf(":");
                k = (k<0? 0 : Number(refA[p].substring(0, k)));
                let refs = sName[k]+" "+refA[p];
                if (c > 1) refs += "&emsp;("+c+")";
                s2 = "<span class='t2'>"+refs+"</span>";
                p++; nc += c;
            } else {
                s2 = "<span class='t1'>"+pLabel[pn]+"</span>";
            }
            let ch = "&nbsp;"
            if (pn == sajda[q]) {
                ch = "۩"; q++;
            }
            let s1 = "background-color: "+toColor(c);
            row += "<td style='"+s1+"'>"+ch+s2+"</td>";
        }
        text += "<tr>"+row+"</tr>";
    }
    tablo.innerHTML = text;
    document.title = TITLE+" -- "+word;
    let t1 = "on "+refA.length+" pages";
    if (nc == 0) 
        out.innerText = "(too many verses)";
    else out.innerText = t1; //nc+" instances "+t1;
    console.log(word, t1); 
    //window.location.hash = "#"+word;
}
function doClick1(evt) {
    let t = evt.target;
    if (t.tagName.toLowerCase() != "span") return;
    t = t.parentElement;
    if (t.tagName.toLowerCase() != "td") return;
    const REF = "http://kuranmeali.com/Sayfalar.php?sayfa=";
    let r = t.parentElement.rowIndex;
    let p = (20*(r-1)+t.cellIndex-1);
    if (p == 1) p = 0; //first page is Fatiha
    console.log("click on p"+p);
    window.open(REF+p, "text", "resizable,scrollbars", true);
}
function doClick2() {
    const REF = "http://corpus.quran.com/qurandictionary.jsp";
    let p = "", v = menu2.value;
    if (v) p = "?q="+toBuckwalter(v);
    console.log("corpus"+p);
    window.open(REF+p, "corpus", "resizable,scrollbars", true);
}

