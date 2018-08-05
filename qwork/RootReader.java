package qwork;

import java.util.Map;
import java.util.TreeMap;
import java.util.Set;
import java.util.TreeSet;
import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.io.IOException;
import org.jqurantree.arabic.ArabicText;

class Root {  //lemmas within each root
    String str;  int numRef = 0;
    Map<String,Lemma> data = new TreeMap<>();
    public Root(String s) { str = s; }
    public String toString() {
        return str+" "+data.size()+" "+numRef;
    }
    public String toCode36() {
        Set<Location> set = new TreeSet<>();
        for (String t : data.keySet()) 
          for (Location n : data.get(t).ref) 
            set.add(n);
        String s = str+"\t";
        for (Location n : set) s += n.toCode36();
        return s;
    }
}

class Lemma {  //reference list for each lemma
    final static int M = 99;
    String str;  int count = 0;
    boolean tooMany = false;
    List<Location> ref = new ArrayList<>();
    public Lemma(String s) { str = s; }
    public void addLoc(Location p) {
        if (ref.size() < M) ref.add(p);
        else tooMany = true;
        count++;
    }
    public String toString() {
        return str+" "+(tooMany? count : ref);
    }
    public String toCode36() {
        String s = str+"\t";
        for (Location n : ref) s += n.toCode36();
        return s;
    }
}

class RootReader implements Runnable {

    Map<String,Root> map = new TreeMap<>(); //roots

    public static final String
        PKG = "qwork",  //all files are in this folder
        IN = "quranic-corpus-morphology-0.4.txt", 
        IN0 = "bes-sure.txt", 
        OUT = "Roots.txt", DAT = "data.txt"; 
        
    public static String toArabic(String s) {
        ArabicText at = ArabicText.fromBuckwalter(s);
        return at.removeDiacritics().toString();
    }
    public int parse(String s) {
        String[] a = s.split(":|\\t|\\(|\\)|\\|");
        if (a.length < 13) return -1;
        String root = null, lem = null;
        for (int i=6; i<a.length; i++) {
            if (a[i].equals("LEM")) lem = a[i+1];
            if (a[i].equals("ROOT")) root = a[i+1];
        }
        if (root == null || lem == null) return -1;
        root = toArabic(root);
        lem = toArabic(lem);
        int c = Integer.parseInt(a[1]);
        int v = Integer.parseInt(a[2]);
        int k = Integer.parseInt(a[3]);
        Location p = new Location(c, v);
        //start with Sad
        //if (root.charAt(0) != 'S') return 0; 
        //System.out.println(p+" "+root+" "+lem);
        Root x = map.get(root);
        if (x == null) {
            x = new Root(root);
            map.put(root, x);
        }
        Lemma y = x.data.get(lem);
        if (y == null) {
            y = new Lemma(lem);
            x.data.put(lem, y);
        }
        y.addLoc(p); x.numRef++;
        return 0;
    }
    public void writeOUT() throws IOException {
        File f = new File(PKG, OUT);
        PrintWriter out = new PrintWriter(f);
        int single = 0, tooMany = 0, n = 0;
        for (String k : map.keySet()) {
            Root x = map.get(k);
            if (x.numRef == 1) {
                single++; continue;
            }
            out.println(x); n++;
            for (String t : x.data.keySet()) {
                Lemma y = x.data.get(t);
                if (y.tooMany) {
                    tooMany++; continue;
                }
                out.println(y); n++;
            }
        }
        out.close();
        System.out.println(n+" lines in "+OUT);
        System.out.println(map.size()+" roots");
        System.out.println(single+" singletons");
        System.out.println(tooMany+" large ref");
    }
    public void writeDAT() throws IOException {
        PrintWriter out = new PrintWriter(DAT);
        int n = 0;
        for (String k : map.keySet()) {
            Root x = map.get(k);
            if (x.numRef == 1) continue;
            if (x.numRef < 25) { //combine all words 
                out.println(x.toCode36()); n++;
            } else {
              out.println(x.str); n++;
              for (String t : x.data.keySet()) {
                Lemma y = x.data.get(t);
                if (y.tooMany) continue;
                out.println(y.toCode36()); n++;
              }
            }
        }
        out.close();
        System.out.println(n+" lines in "+DAT);
    }
    public void run() {
      String[] text = {};
      try {
        File f = new File(PKG, IN);
        if (!f.exists()) f = new File(PKG, IN0);
        InputStream in = new FileInputStream(f);
        byte[] ba = new byte[(int)f.length()]; in.read(ba);
        text = new String(ba).split(System.lineSeparator());
      } catch(IOException e) {
        System.out.println(e);
      }
      System.out.println("Lines: "+text.length);
      for (String s: text) parse(s); //takes time
      try {
        writeOUT(); writeDAT();
      } catch(IOException e) {
        System.out.println(e); 
      }
    }
    public static void main(String[] args) {
        new Thread(new RootReader()).start();
    }
}
/* Summary
128276 lines in IN
 77430 tokens
 18994 distinct tokens
 15142 without Diacritics
 14455 tokens
   687 tokens with no roots

4657 lemmas with roots

5074 lines in Roots.txt
1652 roots
398 singletons
77 large ref
3025 lines in data.txt
*/
