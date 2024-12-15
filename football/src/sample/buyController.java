package sample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

public class buyController {
    Main main;
    @FXML
    private Button exit;
    @FXML
    private Button show;
    @FXML
    private Button buy;
    @FXML
    private TextField playerid;
    @FXML
    private TableView Tableview;
    private boolean init = true;
    ObservableList<buyPlayer> data;
    buyPlayer[]buyPlayerList;

    private void initializeColumns() throws Exception {
        TableColumn<buyPlayer, String> NameCol = new TableColumn<>("Name");
        NameCol.setMinWidth(130);
        NameCol.setCellValueFactory(new PropertyValueFactory<>("Name"));

        TableColumn<buyPlayer, String> CountryCol = new TableColumn<>("Country");
        CountryCol.setMinWidth(80);
        CountryCol.setCellValueFactory(new PropertyValueFactory<>("Country"));

        TableColumn<buyPlayer, String> ClubCol = new TableColumn<>("Club");
        ClubCol.setMinWidth(130);
        ClubCol.setCellValueFactory(new PropertyValueFactory<>("Club"));

        TableColumn<buyPlayer, String> PositionCol = new TableColumn<>("Position");
        PositionCol.setMinWidth(80);
        PositionCol.setCellValueFactory(new PropertyValueFactory<>("Position"));

        TableColumn<buyPlayer, Integer> AgeCol = new TableColumn<>("Age");
        AgeCol.setMinWidth(40);
        AgeCol.setCellValueFactory(new PropertyValueFactory<>("Age"));

        TableColumn<buyPlayer, Integer> NumberCol = new TableColumn<>("Number");
        NumberCol.setMinWidth(40);
        NumberCol.setCellValueFactory(new PropertyValueFactory<>("Number"));

        TableColumn<buyPlayer, Double> HeightCol = new TableColumn<>("Height");
        HeightCol.setMinWidth(80);
        HeightCol.setCellValueFactory(new PropertyValueFactory<>("Height"));

        TableColumn<buyPlayer, Double> SalaryCol = new TableColumn<>("Salary");
        SalaryCol.setMinWidth(80);
        SalaryCol.setCellValueFactory(new PropertyValueFactory<>("Salary"));

        TableColumn<buyPlayer, Double> IDCol = new TableColumn<>("id");
        IDCol.setMinWidth(80);
        IDCol.setCellValueFactory(new PropertyValueFactory<>("id"));
        Tableview.getColumns().addAll(NameCol,CountryCol,ClubCol,PositionCol,AgeCol,NumberCol,HeightCol,SalaryCol,IDCol);
    }
    @FXML
    void showAction(ActionEvent event) throws Exception {
        if (init) {
            initializeColumns();
            init = false;
        }
        data = FXCollections.observableArrayList();
        int count=1;
        buyPlayerList=main.getBuyPlayerList();
        for (int i = 1; i<buyPlayerList.length; i++){
            buyPlayerList[i].setId(count);
            count++;
        }
        buyPlayer bpnull=new buyPlayer("No Players Found",null,null,null,0,0,0,0,0);
        if (buyPlayerList[0] == null)
            data.add(bpnull);
        else
        {
            for (int i = 1;i<buyPlayerList.length; i++){
                data.add(buyPlayerList[i]);
            }
        }
        Tableview.setEditable(true);
        Tableview.setItems(data);

    }
    @FXML
    void buyAction(ActionEvent event) throws Exception {
        String userid=playerid.getText();
        int id=Integer.parseInt(userid);
        for (int i = 0;i<buyPlayerList.length; i++){
           if(buyPlayerList[i].getId()==id){
               try {
                   main.getNetworkUtil().write(buyPlayerList[i]);
               } catch (IOException e) {
                   e.printStackTrace();
               }
           }
        }
        playerid.clear();
    }
    @FXML
    void exitAction(ActionEvent event) throws Exception {
        main.showHome();
    }
    @FXML
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



