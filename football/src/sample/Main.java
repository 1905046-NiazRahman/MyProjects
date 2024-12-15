package sample;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main extends Application {
    private Stage stage;
    private NetworkUtil networkUtil;
    PlayersList player;
    String club=new String();

    public void setclubname(String club){
        this.club=club;
    }
    public String getClub(){
        return club;
    }
    public void playerLoad(List<Players>temp){
        player = new PlayersList();
        for (int i=0;i<temp.size();i++) {
                player.addPlayer(temp.get(i));
        }
    }
    public NetworkUtil getNetworkUtil() {
        return networkUtil;
    }

    public Stage getStage() {
        return stage;
    }
    private void connectToServer() throws IOException {
        String serverAddress = "127.0.0.1";
        int serverPort = 33333;
        networkUtil = new NetworkUtil(serverAddress, serverPort);
        new ReadThread(this);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        stage = primaryStage;
        connectToServer();
        showLog();
    }
    public void showLog() throws Exception {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("LogSample.fxml"));
        Parent root = loader.load();

        LogController controller = loader.getController();
        controller.setMain(this);

        stage.setTitle("Player Home");
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void showHome() throws Exception {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("HomeSample.fxml"));
        Parent root = loader.load();

        HomeController controller = loader.getController();
        controller.setMain(this);

        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
     public void showplayerHome() throws Exception{
         FXMLLoader loader = new FXMLLoader();
         loader.setLocation(getClass().getResource("Playerhome.fxml"));
         Parent root = loader.load();
         PlayerhomeController controller = loader.getController();
         controller.setMain(this);
         stage.setTitle(getClub());
         stage.setScene(new Scene(root, 1065, 744));
         stage.show();
     }
    public void showCount() throws Exception{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("Count.fxml"));
        Parent root = loader.load();
        CountController controller = loader.getController();
        controller.setMain(this);
        controller.load();
        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void showclubHome() throws Exception{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("Clubhome.fxml"));
        Parent root = loader.load();
        ClubhomeController controller = loader.getController();
        controller.setMain(this);
        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void addplayer() throws Exception{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("Addplayer.fxml"));
        Parent root = loader.load();
        AddplayerController controller = loader.getController();
        controller.setMain(this);
        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void showSell() throws Exception{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("sell.fxml"));
        Parent root = loader.load();
        sellController controller = loader.getController();
        controller.setMain(this);
        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void showBuy() throws Exception{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("buy.fxml"));
        Parent root = loader.load();
        buyController controller = loader.getController();
        controller.setMain(this);
        stage.setTitle(getClub());
        stage.setScene(new Scene(root, 1065, 744));
        stage.show();
    }
    public void showAlert() {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Incorrect Credentials");
        alert.setHeaderText("Incorrect Credentials");
        alert.setContentText("The username and password you provided is not correct.");
        alert.showAndWait();
    }


    public Players[] playermenu1(String name) {
        Players[] p = player.SearchByPlayerName(name);
        return p;
    }
    public Players[] playermenu2(String club,String country) {
        Players[] p = player.SearchByClubAndCountry(club,country);
        return p;
    }
    public Players[] playermenu3(String Position) {
        Players[] p = player.SearchByPosition(Position);
        return p;
    }
    public Players[] playermenu4(double min,double max) {
        Players[] p = player.SearchBySalary(min,max);
        return p;
    }
    public String[][]playermenu5() {
        String[][] st = player.CountPlayers();
        return st;
    }
    public Players[] clubmenu1(String club) {
        Players[] p = player.SearchByMaxSalary(club);
        return p;
    }
    public Players[] clubmenu2(String club) {
        Players[] p = player.SearchByMaxAge(club);
        return p;
    }
    public Players[] clubmenu3(String club) {
        Players[] p = player.SearchByMaxHeight(club);
        return p;
    }
    public double clubmenu4(String club) {
        double salary = player.TotalSalary(club);
        return salary;
    }
    public void add(String name,String country,String club,String position,int age,int number, double height,double salary)throws Exception{
        Players p=new Players(name,country,getClub(),position,age,number,height,salary);
        player.addPlayer(p);
        getNetworkUtil().write(p);
    }
    public Players[] getPlayer(){
        Players[] p = player.getPlayers();
        return p;
    }
    buyPlayer []buyPlayerList;
    public synchronized void buyLoad(buyPlayer []bp){
        buyPlayerList=new buyPlayer[bp.length];
        for (int i=0;i<bp.length;i++) {
            buyPlayerList[i]=bp[i];
        }
    }
    public buyPlayer[] getBuyPlayerList(){
        return buyPlayerList;
    }

    sellPlayer []sellPlayerList;
    public void sellLoad(sellPlayer []sp){
        sellPlayerList=new sellPlayer[sp.length];
        for (int i=0;i<sp.length;i++) {
            sellPlayerList[i]=sp[i];
        }
    }
    public synchronized sellPlayer[] getSellPlayerList(){
        return sellPlayerList;
    }

    public void exit(){
        System.exit(0);
    }


    public static void main(String[] args) {
        launch(args);
    }
}
