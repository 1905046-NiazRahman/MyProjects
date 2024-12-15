package sample;

public class Country {

        private String country;
        private int count;
        public Country(){
            count=0;
        }
        public Country(String country,int count){
            this.country=country;
            this.count=count;
        }
        public void setCountry(String country){
            this.country=country;
        }
        public String getCountry(){
            return country;
        }
        public void setCount(int count){
            this.count=count;
        }
        public int getCount(){
            return count;
        }
}

