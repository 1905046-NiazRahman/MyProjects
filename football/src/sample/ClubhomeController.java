package sample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

import java.io.IOException;

public class ClubhomeController {
    Main main;
    @FXML
    private Button maxsalary;
    @FXML
    private Button maxage;
    @FXML
    private Button maxheight;
    @FXML
    private Button salary;
    @FXML
    private Button exit;
    @FXML
    private TextField clubname;
    @FXML
    private Label yearlysalary;
    @FXML
    private TableView Tableview;
    ObservableList<Players> data;
    private boolean init = true;
    private void initializeColumns() throws Exception {
        TableColumn<Players, String> NameCol = new TableColumn<>("Name");
        NameCol.setMinWidth(160);
        NameCol.setCellValueFactory(new PropertyValueFactory<>("Name"));

        TableColumn<Players, String> CountryCol = new TableColumn<>("Country");
        CountryCol.setMinWidth(130);
        CountryCol.setCellValueFactory(new PropertyValueFactory<>("Country"));

        TableColumn<Players, String> ClubCol = new TableColumn<>("Club");
        ClubCol.setMinWidth(130);
        ClubCol.setCellValueFactory(new PropertyValueFactory<>("Club"));

        TableColumn<Players, String> PositionCol = new TableColumn<>("Position");
        PositionCol.setMinWidth(130);
        PositionCol.setCellValueFactory(new PropertyValueFactory<>("Position"));

        TableColumn<Players, Integer> AgeCol = new TableColumn<>("Age");
        AgeCol.setMinWidth(80);
        AgeCol.setCellValueFactory(new PropertyValueFactory<>("Age"));

        TableColumn<Players, Integer> NumberCol = new TableColumn<>("Number");
        NumberCol.setMinWidth(40);
        NumberCol.setCellValueFactory(new PropertyValueFactory<>("Number"));

        TableColumn<Players, Double> HeightCol = new TableColumn<>("Height");
        HeightCol.setMinWidth(80);
        HeightCol.setCellValueFactory(new PropertyValueFactory<>("Height"));

        TableColumn<Players, Double> SalaryCol = new TableColumn<>("Salary");
        SalaryCol.setMinWidth(130);
        SalaryCol.setCellValueFactory(new PropertyValueFactory<>("Salary"));

        Tableview.getColumns().addAll(NameCol,CountryCol,ClubCol,PositionCol,AgeCol,NumberCol,HeightCol,SalaryCol);
    }
    public void maxsalaryAction(ActionEvent event)throws Exception{
        String userName = main.getClub();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.clubmenu1(userName);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        yearlysalary.setText(null);
        Tableview.setEditable(true);
        Tableview.setItems(data);
    }
    public void maxAgeAction(ActionEvent event)throws Exception{
        String userName = main.getClub();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.clubmenu2(userName);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        yearlysalary.setText(null);
        Tableview.setEditable(true);
        Tableview.setItems(data);
    }
    public void maxheightAction(ActionEvent event)throws Exception{
        String userName = main.getClub();
        if (init) {
            initializeColumns();
            init = false;
        }
        Players pnull=new Players("No Players Found",null,null,null,0,0,0,0);
        data = FXCollections.observableArrayList();
        Players[]p=main.clubmenu3(userName);
        if (p[0] == null)
            data.add(pnull);
        else
        {
            for (int i = 0; p[i] != null; i++){
                data.add(p[i]);
            }
        }
        yearlysalary.setText(null);
        Tableview.setEditable(true);
        Tableview.setItems(data);
    }
    public void salaryAction(ActionEvent event)throws Exception{
        if (init) {
            initializeColumns();
            init = false;
        }
        data = FXCollections.observableArrayList();
        String userName = main.getClub();
        double salary=main.clubmenu4(userName);
        String sal= String.format("%.0f",salary);
        yearlysalary.setText(sal);
        Tableview.setEditable(true);
        Tableview.setItems(data);
    }
    public void syncAction(ActionEvent event)throws Exception {
        try {
            main.getNetworkUtil().write(null);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void exitAction(ActionEvent event)throws Exception {
        main.showHome();
    }

    void setMain(Main main) {
        this.main = main;
    }
}
