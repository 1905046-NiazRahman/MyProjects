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

public class sellController {
    Main main;
    @FXML
    private Button exit;
    @FXML
    private Button show;
    @FXML
    private Button sell;
    @FXML
    private TextField playerid;
    @FXML
    private TableView Tableview;
    private boolean init = true;
    ObservableList<sellPlayer> data;
    sellPlayer[]sp;

    private void initializeColumns() throws Exception {
        TableColumn<sellPlayer, String> NameCol = new TableColumn<>("Name");
        NameCol.setMinWidth(130);
        NameCol.setCellValueFactory(new PropertyValueFactory<>("Name"));

        TableColumn<sellPlayer, String> CountryCol = new TableColumn<>("Country");
        CountryCol.setMinWidth(80);
        CountryCol.setCellValueFactory(new PropertyValueFactory<>("Country"));

        TableColumn<sellPlayer, String> ClubCol = new TableColumn<>("Club");
        ClubCol.setMinWidth(130);
        ClubCol.setCellValueFactory(new PropertyValueFactory<>("Club"));

        TableColumn<sellPlayer, String> PositionCol = new TableColumn<>("Position");
        PositionCol.setMinWidth(80);
        PositionCol.setCellValueFactory(new PropertyValueFactory<>("Position"));

        TableColumn<sellPlayer, Integer> AgeCol = new TableColumn<>("Age");
        AgeCol.setMinWidth(40);
        AgeCol.setCellValueFactory(new PropertyValueFactory<>("Age"));

        TableColumn<sellPlayer, Integer> NumberCol = new TableColumn<>("Number");
        NumberCol.setMinWidth(40);
        NumberCol.setCellValueFactory(new PropertyValueFactory<>("Number"));

        TableColumn<sellPlayer, Double> HeightCol = new TableColumn<>("Height");
        HeightCol.setMinWidth(80);
        HeightCol.setCellValueFactory(new PropertyValueFactory<>("Height"));

        TableColumn<sellPlayer, Double> SalaryCol = new TableColumn<>("Salary");
        SalaryCol.setMinWidth(80);
        SalaryCol.setCellValueFactory(new PropertyValueFactory<>("Salary"));

        TableColumn<sellPlayer, Double> IDCol = new TableColumn<>("id");
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
        int count=1;
        data = FXCollections.observableArrayList();
        sp=main.getSellPlayerList();
        for (int i = 0; i<sp.length; i++){
            sp[i].setId(count);
            count++;
        }
        sellPlayer spnull=new sellPlayer("No Players Found",null,null,null,0,0,0,0,0);
        if (sp[0] == null)
            data.add(spnull);
        else
        {
            for (int i = 0; i<sp.length; i++){
                data.add(sp[i]);
            }
        }
        Tableview.setEditable(true);
        Tableview.setItems(data);
    }
    @FXML
    void sellAction(ActionEvent event) throws Exception {
        String userid = playerid.getText();
        int id=Integer.parseInt(userid);
        sellPlayer sellPlayer=new sellPlayer();
        for (int i = 0; i<sp.length; i++){
            if(sp[i].getId()==id){
                sellPlayer=sp[i];
            }
        }
        try {
            main.getNetworkUtil().write(sellPlayer);
        } catch (IOException e) {
            e.printStackTrace();
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
