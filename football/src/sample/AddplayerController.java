package sample;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

public class AddplayerController {
    Main main;

    @FXML
    private Button exit;
    @FXML
    private Button add;
    @FXML
    private TextField name;
    @FXML
    private TextField club;
    @FXML
    private TextField country;
    @FXML
    private TextField position;
    @FXML
    private TextField age;
    @FXML
    private TextField number;
    @FXML
    private TextField height;
    @FXML
    private TextField salary;

    public void addAction(ActionEvent event)throws Exception{
        String username=name.getText();
        String userclub=club.getText();
        String usercountry=country.getText();
        String userposition=position.getText();
        String userage=age.getText();
        String usernumber=number.getText();
        String userheight=height.getText();
        String usersalary=salary.getText();
        main.add(username,usercountry,userclub,userposition,Integer.parseInt(userage),Integer.parseInt(usernumber),Double.parseDouble(userheight),Double.parseDouble(usersalary));
        name.clear();;
        club.clear();
        country.clear();
        position.clear();
        age.clear();
        number.clear();
        height.clear();
        salary.clear();
    }
    public void exitAction(ActionEvent event)throws Exception{
        main.showHome();
    }

    void setMain(Main main) {
        this.main = main;
    }
}
