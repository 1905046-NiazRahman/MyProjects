package sample;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.beans.property.SimpleStringProperty;
import javafx.scene.control.cell.PropertyValueFactory;

import java.io.IOException;

public class PlayerhomeController {
    Main main;
    @FXML
    private Button name;
    @FXML
    private Button club;
    @FXML
    private Button position;
    @FXML
    private Button salary;
    @FXML
    private Button count;
    @FXML
    private Button exit;
    @FXML
    private TextField playername;
    @FXML
    private TextField clubname;
    @FXML
    private TextField countryname;
    @FXML
    private TextField positionname;
    @FXML
    private TextField min;
    @FXML
    private TextField max;
    @FXML
    private Label output;
    @FXML
    private TableView Tableview;


    ObservableList<Players> data;
    ObservableList<Country> data2;

    private boolean init = true;
    private Players p;

    private void initializeColumns() throws Exception {
        TableColumn<Players, String> NameCol = new TableColumn<>("Name");
        NameCol.setMinWidth(160);
        NameCol.setCellValueFactory(new PropertyValueFactory<>("Name"));

        TableColumn<Players, String> CountryCol = new TableColumn<>("Country");
        CountryCol.setMinWidth(80);
        CountryCol.setCellValueFactory(new PropertyValueFactory<>("Country"));

        TableColumn<Players, String> ClubCol = new TableColumn<>("Club");
        ClubCol.setMinWidth(130);
        ClubCol.setCellValueFactory(new PropertyValueFactory<>("Club"));

        TableColumn<Players, String> PositionCol = new TableColumn<>("Position");
        PositionCol.setMinWidth(80);
        PositionCol.setCellValueFactory(new PropertyValueFactory<>("Position"));

        TableColumn<Players, Integer> AgeCol = new TableColumn<>("Age");
        AgeCol.setMinWidth(40);
        AgeCol.setCellValueFactory(new PropertyValueFactory<>("Age"));

        TableColumn<Players, Integer> NumberCol = new TableColumn<>("Number");
        NumberCol.setMinWidth(40);
        NumberCol.setCellValueFactory(new PropertyValueFactory<>("Number"));

        TableColumn<Players, Double> HeightCol = new TableColumn<>("Height");
        HeightCol.setMinWidth(40);
        HeightCol.setCellValueFactory(new PropertyValueFactory<>("Height"));

        TableColumn<Players, Double> SalaryCol = new TableColumn<>("Salary");
        SalaryCol.setMinWidth(80);
        SalaryCol.setCellValueFactory(new PropertyValueFactory<>("Salary"));

        Tableview.getColumns().addAll(NameCol,CountryCol,ClubCol,PositionCol,AgeCol,NumberCol,HeightCol,SalaryCol);
    }
    public void nameAction(ActionEvent event)throws Exception{
        String userName = playername.getText();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.playermenu1(userName);
        if (p[0] == null)
            data.add(pnull);
        else
            {
                for (int i = 0; p[i] != null; i++){
                    data.add(p[i]);
                }
            }
        Tableview.setEditable(true);
        Tableview.setItems(data);
        playername.clear();
    }
    public void clubAction(ActionEvent event)throws Exception{
        String userName = main.getClub();
        String userName2=countryname.getText();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.playermenu2(userName,userName2);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        Tableview.setEditable(true);
        Tableview.setItems(data);
        clubname.clear();
        countryname.clear();
    }
    public void positionAction(ActionEvent event)throws Exception{
        String userName = positionname.getText();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.playermenu3(userName);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        Tableview.setEditable(true);
        Tableview.setItems(data);
        positionname.clear();
    }
    public void salaryAction(ActionEvent event)throws Exception{
        String userName = min.getText();
        String userName2=max.getText();
        double minimum=0;
        double maximum=0;
        if(userName==null||userName2==null){
            minimum=0;
            maximum=0;
        }else{
         minimum=Double.parseDouble(userName);
         maximum=Double.parseDouble(userName2);}

        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.playermenu4(minimum,maximum);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        Tableview.setEditable(true);
        Tableview.setItems(data);
        min.clear();
        max.clear();
    }

    public void countAction(ActionEvent event)throws Exception{
        main.showCount();
    }
    public void exitAction(ActionEvent event)throws Exception {
        main.showHome();
    }
    public void syncAction(ActionEvent event)throws Exception {
        try {
            main.getNetworkUtil().write(null);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    void setMain(Main main) {
        this.main = main;
    }
}
