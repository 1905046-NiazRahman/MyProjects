package sample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.text.Text;
public class CountController {
    Main main;
    ObservableList<Country> data;

    private boolean init = true;
    @FXML
    private TableView tableview;
    @FXML
    private Button back;
    private void initializeColumns() throws Exception{
        TableColumn<Country, String> CountryCol = new TableColumn<>("country");
        CountryCol.setMinWidth(500);
        CountryCol.setCellValueFactory(new PropertyValueFactory<>("country"));

        TableColumn<Country, Integer> CountCol = new TableColumn<>("count");
        CountCol.setMinWidth(400);
        CountCol.setCellValueFactory(new PropertyValueFactory<>("count"));

        tableview.getColumns().addAll(CountryCol,CountCol);
    }
    public void load() throws Exception{
        if (init) {
            initializeColumns();
            init = false;
        }
        data = FXCollections.observableArrayList();

        String[][]st=main.playermenu5();
        Country []c=new Country[100];
        int count=0;
        for (int i=0;st[i][0]!=null;i++){
            c[count++]=new Country(st[i][0],Integer.parseInt(st[i][1]));
        }
        for (int i=0;c[i]!=null; i++){
            data.add(c[i]);
        }
        tableview.setEditable(true);
        tableview.setItems(data);
    }
    public void backAction()throws Exception{
        main.showplayerHome();
    }
    void setMain(Main main) {
        this.main = main;
    }
}
