package sample;
import java.io.Serializable;
public class Players implements Serializable {
    private String name;
    private String country;
    private String club;
    private String position;
    private int age;
    private int number;
    private double height;
    private double salary;
    String[][] st=null;
    public Players(){
            age=0;
            number=0;
            height=0.0;
            salary=0.0;
    }
    public Players(String name,String country,String club,String position,int number,int age, double height,double salary){
        this.name=name;
        this.country=country;
        this.club=club;
        this.position=position;
        this.age=age;
        this.number=number;
        this.height=height;
        this.salary=salary;
    }

    public void setName(String name){
        this.name=name;
    }
    public String getName(){
        return name;
    }
    public void setCountry(String country){
        this.country=country;
    }
    public String getCountry(){
        return country;
    }
    public void setClub(String club){
        this.club=club;
    }
    public String getClub(){
        return club;
    }
    public void setPosition(String position){
        this.position=position;
    }
    public String getPosition(){
        return position;
    }
    public void setAge(int age){
        this.age=age;
    }
    public int getAge(){
        return age;
    }
    public void setNumber(int number){
        this.number=number;
    }
    public int getNumber(){
        return number;
    }
    public void setHeight(double height){
        this.height=height;
    }
    public double getHeight(){
        return height;
    }
    public void setSalary(double salary){
        this.salary=salary;
    }
    public double getSalary(){
        return salary;
    }

    public void printPlayers() {
        System.out.println("Name: "+getName());
        System.out.println("Age: "+getAge());
        System.out.println("Club: "+getClub());
        System.out.println("Country: "+getCountry());
        System.out.println("Height: "+getHeight());
        System.out.println("Number: "+getNumber());
        System.out.println("Salary: "+getSalary());
        System.out.println();
    }

}
