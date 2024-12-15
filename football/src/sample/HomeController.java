package sample;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;

public class HomeController {
    private Main main;

    @FXML
    private Button playerbutton;
    @FXML
    private Button clubbutton;
    @FXML
    private Button addbutton;
    @FXML
    private Button exitbutton;
    @FXML
    private Button sell;
    @FXML
    private Button buy;

    @FXML
    void playerbuttonAction(ActionEvent event) throws Exception {
        main.showplayerHome();
    }
    @FXML
    void clubAction(ActionEvent event) throws Exception {
        main.showclubHome();
    }
    @FXML
    void addAction(ActionEvent event) throws Exception {
        main.addplayer();
    }
    @FXML
    void sellAction(ActionEvent event) throws Exception {
        main.showSell();
    }
    @FXML
    void buyAction(ActionEvent event) throws Exception {
        main.showBuy();
    }

    @FXML
    void exitAction(ActionEvent event) throws Exception {
        main.showLog();
    }

    void setMain(Main main) {
        this.main = main;
    }
}
