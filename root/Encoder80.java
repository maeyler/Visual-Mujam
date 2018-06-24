class Encoder80 { //convert to base 80
    final static int BASE = 80, 
        MAX_VAL = BASE*BASE; //2 unicode digits, 4 bytes
    final static char MIN = 7680, MAX = MIN+BASE-1;
    public static String encode(long n) {
        String s = "";
        while (n > 0) {
            char c = (char)(MIN + n%BASE);
            s = c + s; n = n/BASE;
        }
        return s;
    }
    public static String encode(int n) {
        if (n >= MAX_VAL) 
            return encode((long)n);
        char c2 = (char)(MIN + n%BASE); 
        char c1 = (char)(MIN + n/BASE);
        return ""+c1+c2;
    }
    public static long decode(String s) {
        long n = 0;
        for (int i=0; i<s.length(); i++) {
            char c = s.charAt(i);
            if (c<MIN || c>MAX) return -1;
            n = BASE*n + (c-MIN);
        }
        return n;
    }
    public static void test(long n) {
        String s = encode(n);
        System.out.println(n+" "+s+" "+decode(s));
    }
    public static void main(String[] args) {
        for (int i=10, k=-5; i<50000000; i=3*i+k, k--)
            test(i);
    }
}
