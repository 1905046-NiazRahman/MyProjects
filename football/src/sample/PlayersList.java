package sample;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;

public class PlayersList implements Serializable{
    private List<Players> playersList1;
    //private static final String INPUT_FILE_NAME = "players.txt";
    //private static final String OUTPUT_FILE_NAME = "players.txt";
    public PlayersList(){
        playersList1=new ArrayList();
    }

    /*public List<Players> readFromFile() throws Exception {
        List<Players> PlayersList2 = new ArrayList();
        BufferedReader br = new BufferedReader(new FileReader(INPUT_FILE_NAME));
        while (true) {
            String line = br.readLine();
            if (line == null)
                break;
            String[] tokens = line.split(",");
            Players p = new Players();
            p.setName(tokens[0]);
            p.setCountry(tokens[1]);
            p.setAge(Integer.parseInt(tokens[2]));
            p.setHeight(Double.parseDouble(tokens[3]));
            p.setClub(tokens[4]);
            p.setPosition(tokens[5]);
            p.setNumber(Integer.parseInt(tokens[6]));
            p.setSalary(Double.parseDouble(tokens[7]));
            PlayersList2.add(p);
        }
        br.close();
        return PlayersList2;
    }
    public void WriteToFile() throws Exception {
        BufferedWriter bw = new BufferedWriter(new FileWriter(OUTPUT_FILE_NAME));
        for (Players s : playersList1) {
            bw.write(s.getName() + "," + s.getCountry() + "," + s.getAge() + "," + s.getHeight() + "," + s.getClub() + "," + s.getPosition() + "," + s.getNumber() + "," + s.getSalary());
            bw.write("\n");
        }
        bw.close();
    }*/
    public boolean checkName(String name){
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getName().equalsIgnoreCase(name)) {
               return true;
            }
        }
        return false;
    }
    public boolean checkClub(String club){
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                count++;
            }
        }
        if(count<7)
            return true;
        return false;
    }
    public boolean checkPosition(String position){
        if(position.equalsIgnoreCase("forward")||position.equalsIgnoreCase("midfielder")||position.equalsIgnoreCase("defender")||position.equalsIgnoreCase("goalkeeper"))
            return true;
        return false;
    }
    public boolean checkNumber(int number,String club){
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getClub().equalsIgnoreCase(club)&&playersList1.get(i).getNumber()==number) {
                return true;
            }
        }
        return false;
    }

    public void addPlayer(Players p) {
        playersList1.add(p);
    }

    public Players[] SearchByPlayerName(String name) {
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getName().equalsIgnoreCase(name)) {
                p[count++]=playersList1.get(i);
            }
        }
        return p;
    }

    public Players[] SearchByClubAndCountry(String club, String country) {
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (country.equalsIgnoreCase("ANY")) {
                if (club.equalsIgnoreCase("ANY")) {
                    p[count++]=playersList1.get(i);
                } else if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                    p[count++]=playersList1.get(i);
                }
            }
            else if (playersList1.get(i).getCountry().equalsIgnoreCase(country)) {
                if (club.equalsIgnoreCase("ANY")) {
                    p[count++]=playersList1.get(i);
                } else if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                    p[count++]=playersList1.get(i);
                }
            }
        }
        return p;

    }

    public Players[] SearchByPosition(String position) {
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if(playersList1.get(i).getPosition().equalsIgnoreCase(position)){
                    p[count++] = playersList1.get(i);
                }
            }

        return p;

    }

    public Players[] SearchBySalary(double salaryMin, double salaryMax) {
        Players []p=new Players[100];
        int count=0;
        double temp=0;
        if(salaryMin>salaryMax){
            temp=salaryMax;
            salaryMax=salaryMin;
            salaryMin=temp;
        }

        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getSalary() <= salaryMax && playersList1.get(i).getSalary() >= salaryMin) {
                p[count++]=playersList1.get(i);
            }
        }
        return p;

    }

    public String[][] CountPlayers() {
      String []name=new String[1000];
      int []count=new int[1000];
        int c=0;
        boolean isFound=false;
        String [][] st=new String[1000][2];
        for (int i = 0; i < playersList1.size(); i++) {
            for(int j=0;j< c+1;j++){
                if(playersList1.get(i).getCountry().equalsIgnoreCase(name[j])) {
                    count[j]++;
                    isFound=true;
                }
            }
            if(isFound==false){
                name[c]=playersList1.get(i).getCountry();
                count[c]=1;
                c++;
            }
            isFound=false;
        }
        for (int i=0;i<c;i++)
              for(int j=0;j<2;j++){
                  st[i][0]=name[i];
                  st[i][1]=Integer.toString(count[i]);
              }
        return st;
    }

    public String[][] CountClub() {
        String []name=new String[1000];
        int []count=new int[1000];
        int c=0;
        boolean isFound=false;
        String [][] st=new String[1000][2];
        for (int i = 0; i < playersList1.size(); i++) {
            for(int j=0;j< c+1;j++){
                if(playersList1.get(i).getClub().equalsIgnoreCase(name[j])) {
                    count[j]++;
                    isFound=true;
                }
            }
            if(isFound==false){
                name[c]=playersList1.get(i).getClub();
                count[c]=1;
                c++;
            }
            isFound=false;
        }
        for (int i=0;i<c;i++)
            for(int j=0;j<2;j++){
                st[i][0]=name[i];
                st[i][1]=Integer.toString(count[i]);
            }
        return st;
    }

    public Players[] SearchByMaxAge(String club) {
        double max = 0.0;
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getAge();
                break;
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getAge() > max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getAge();
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getAge() == max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                p[count++]=playersList1.get(i);
            }
        }
        return p;
    }

    public Players[] SearchByMaxHeight(String club) {
        double max = 0.0;
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getHeight();
                break;
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getHeight() > max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getHeight();
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getHeight() == max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                p[count++]=playersList1.get(i);
            }
        }
        return p;
    }

    public Players[] SearchByMaxSalary(String club) {
        double max = 0.0;
        Players []p=new Players[100];
        int count=0;
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getSalary();
                break;
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getSalary() > max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                max = playersList1.get(i).getSalary();
            }
        }
        for (int i = 0; i < playersList1.size(); i++) {
            if (playersList1.get(i).getSalary() == max && playersList1.get(i).getClub().equalsIgnoreCase(club)) {
                p[count++]=playersList1.get(i);
            }
        }
        return p;
    }
    public double TotalSalary(String club){
        double salary=0;
        for(int i=0;i< playersList1.size();i++){
            if(playersList1.get(i).getClub().equalsIgnoreCase(club)){
            salary=salary+playersList1.get(i).getSalary()*52;
            }
        }
        if(salary!=0)
            return salary;
        return 0;
    }
    public Players[] getPlayers(){
        Players []p=new Players[10000];
        int count=0;
        for(int i=0;i< playersList1.size();i++){
            p[count++]=playersList1.get(i);
        }
        return p;
    }
    public void removePlayer(String name){
        for(int i=0;i<playersList1.size();i++){
            if(playersList1.get(i).getName().equalsIgnoreCase(name)){
                playersList1.remove(i);
                break;
            }
        }
    }
    public void changeclub(String name,String club)throws Exception{
        for(int i=0;i<playersList1.size();i++){
            if(playersList1.get(i).getName().equalsIgnoreCase(name)){
                playersList1.get(i).setClub(club);
                System.out.println("true");
                break;
            }
        }
    }
}
