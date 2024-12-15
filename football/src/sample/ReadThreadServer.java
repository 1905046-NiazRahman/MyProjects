package sample;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class ReadThreadServer implements Runnable {
    public Thread thr;
    public NetworkUtil networkUtil;
    public HashMap<String, String> userMap;
    public List<Players> PlayersList;
    public List<buyPlayer> buyPlayerList;
    public List<sellPlayer> sellPlayerList;
    public List<sellPlayer> tempList;
    public String clubname;
    public boolean flag=false;


    private static final String INPUT_FILE_NAME = "marketplace.txt";
    private static final String OUTPUT_FILE_NAME = "marketplace.txt";


    public ReadThreadServer(HashMap<String, String> map, NetworkUtil networkUtil) {
        this.userMap = map;
        this.networkUtil = networkUtil;
        this.thr = new Thread(this);
        thr.start();
        buyPlayerList=new ArrayList();
        sellPlayerList=new ArrayList();
        tempList=new ArrayList();
        PlayersList= new ArrayList<>();
    }
    public List<sellPlayer> readFromFile() throws Exception {
        List<sellPlayer> PlayersList2 = new ArrayList();
        BufferedReader br = new BufferedReader(new FileReader(INPUT_FILE_NAME));
        while (true) {
            String line = br.readLine();
            if (line == null)
                break;
            String[] tokens = line.split(",");
            sellPlayer p = new sellPlayer();
            p.setName(tokens[0]);
            p.setCountry(tokens[1]);
            p.setAge(Integer.parseInt(tokens[2]));
            p.setHeight(Double.parseDouble(tokens[3]));
            p.setClub(tokens[4]);
            p.setPosition(tokens[5]);
            p.setNumber(Integer.parseInt(tokens[6]));
            p.setSalary(Double.parseDouble(tokens[7]));
            p.setId(Integer.parseInt(tokens[8]));
            PlayersList2.add(p);
        }
        br.close();
        return PlayersList2;
    }
    public List<buyPlayer> readFromFile2() throws Exception {
        List<buyPlayer> PlayersList2 = new ArrayList();
        BufferedReader br = new BufferedReader(new FileReader(INPUT_FILE_NAME));
        while (true) {
            String line = br.readLine();
            if (line == null)
                break;
            String[] tokens = line.split(",");
            buyPlayer p = new buyPlayer();
            p.setName(tokens[0]);
            p.setCountry(tokens[1]);
            p.setAge(Integer.parseInt(tokens[2]));
            p.setHeight(Double.parseDouble(tokens[3]));
            p.setClub(tokens[4]);
            p.setPosition(tokens[5]);
            p.setNumber(Integer.parseInt(tokens[6]));
            p.setSalary(Double.parseDouble(tokens[7]));
            p.setId(Integer.parseInt(tokens[8]));
            PlayersList2.add(p);
        }
        br.close();
        return PlayersList2;
    }
    public void WriteToFile(List<sellPlayer> sp) throws Exception {
        BufferedWriter bw = new BufferedWriter(new FileWriter(OUTPUT_FILE_NAME));
        BufferedReader br = new BufferedReader(new FileReader(INPUT_FILE_NAME));
        int id=0;
        for (sellPlayer s : sp) {
            bw.write(s.getName() + "," + s.getCountry() + "," + s.getAge() + "," + s.getHeight() + "," + s.getClub() + "," + s.getPosition() + "," + s.getNumber() + "," + s.getSalary()+ "," +id);
            bw.write("\n");
        }
        br.close();
        bw.close();
    }
    public List<Players> readFromFile3() throws Exception {
        List<Players> PlayersList2 = new ArrayList();
        BufferedReader br = new BufferedReader(new FileReader("players.txt"));
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
    public void WriteToFile2() throws Exception {
        BufferedWriter bw = new BufferedWriter(new FileWriter("players.txt"));
        for (Players s : PlayersList) {
            bw.write(s.getName() + "," + s.getCountry() + "," + s.getAge() + "," + s.getHeight() + "," + s.getClub() + "," + s.getPosition() + "," + s.getNumber() + "," + s.getSalary());
            bw.write("\n");
        }
        bw.close();
    }

    public void removePlayer(String name){
        for(int i=0;i<PlayersList.size();i++){
            if(PlayersList.get(i).getName().equalsIgnoreCase(name)){
                PlayersList.remove(i);
                break;
            }
        }
    }
    public void run() {
        try {
            while (true) {
                PlayersList= readFromFile3();
                Object o = networkUtil.read();
                if (o != null) {
                    if (o instanceof LoginDTO) {
                        LoginDTO loginDTO = (LoginDTO) o;
                        String password = userMap.get(loginDTO.getUserName());
                        loginDTO.setStatus(loginDTO.getPassword().equals(password));
                        clubname=loginDTO.getUserName();
                        networkUtil.write(loginDTO);
                    }
                    if(o instanceof Players){
                        Players p=(Players)o;
                        PlayersList.add(p);
                        WriteToFile2();
                    }
                    if(o instanceof sellPlayer){
                        sellPlayer sp=(sellPlayer)o;
                        tempList=readFromFile();
                        tempList.add(sp);
                        for(int i=0;i<PlayersList.size();i++){
                            if(PlayersList.get(i).getName().equalsIgnoreCase(sp.getName())){
                                PlayersList.remove(i);
                                break;
                            }
                        }
                        WriteToFile2();
                        WriteToFile(tempList);
                    }
                    if(o instanceof buyPlayer){
                        tempList=readFromFile();
                        buyPlayer p=(buyPlayer)o;
                        Players pl=new Players(p.getName(),p.getCountry(),clubname,p.getPosition(),p.getNumber(),p.getAge(),p.getHeight(),p.getSalary());
                        removePlayer(p.getName());
                        PlayersList.add(pl);
                        WriteToFile2();
                        for(int i=0;i<tempList.size();i++){
                            if(tempList.get(i).getName().equalsIgnoreCase(p.getName())){
                                tempList.remove(i);
                                break;
                            }
                        }
                        WriteToFile(tempList);
                    }
                }
                PlayersList= readFromFile3();
                List<Players> PlayersList2=new ArrayList<>();
                for (int i=0;i<PlayersList.size();i++) {
                    if(PlayersList.get(i).getClub().equalsIgnoreCase(clubname)){
                        PlayersList2.add(PlayersList.get(i));
                    }
                }
                networkUtil.write(PlayersList2);
                sellPlayer sp[]=new sellPlayer[PlayersList2.size()];
                for(int i=0;i<PlayersList2.size();i++){
                    sp[i]=new sellPlayer(PlayersList2.get(i).getName(),PlayersList2.get(i).getCountry(),PlayersList2.get(i).getClub(),PlayersList2.get(i).getPosition(),PlayersList2.get(i).getNumber(),PlayersList2.get(i).getAge(),PlayersList2.get(i).getHeight(),PlayersList2.get(i).getSalary(),i+1);
                }
                networkUtil.write(sp);
                List<buyPlayer> buyPlayerList=readFromFile2();
                buyPlayer bp[]=new buyPlayer[buyPlayerList.size()];
                for(int i=0;i<buyPlayerList.size();i++){
                    bp[i]=new buyPlayer(buyPlayerList.get(i).getName(),buyPlayerList.get(i).getCountry(),buyPlayerList.get(i).getClub(),buyPlayerList.get(i).getPosition(),buyPlayerList.get(i).getNumber(),buyPlayerList.get(i).getAge(),buyPlayerList.get(i).getHeight(),buyPlayerList.get(i).getSalary(),buyPlayerList.get(i).getId());
                }
                networkUtil.write(bp);
            }
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            try {
                networkUtil.closeConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}




