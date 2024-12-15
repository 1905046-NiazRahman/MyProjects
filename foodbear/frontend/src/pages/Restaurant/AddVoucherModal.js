import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddVoucherModal = ({ show, onHide }) => {
    const [voucher, setVoucher] = useState({
        voucherCode: "",
        expiryDate: "",
        minimumAmount: "",
        discount: "",
        maxUsage: "",
    });

    const [users, setUsers] = useState([]);
    const restaurantId = localStorage.getItem("restaurant_id");

    useEffect(() => {
        
        // Replace with your actual API endpoint to fetch users
        axios.get("http://localhost:4010/api/voucher/getallusers")
            .then(response => {
                console.log("Users:", response.data)
                setUsers(response.data.map(user => ({ user_id: user._id, max_usage: voucher.maxUsage })));
            })
            .catch(error => console.error('Error:', error));
    }, [voucher]);

    const onChange = (e) => {
        setVoucher({ ...voucher, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = [];

        if (voucher.voucherCode.trim() === "") {
            errors.push("Voucher Code must not be empty");
        }

        if (voucher.expiryDate.trim() === "") {
            errors.push("Expiry Date must not be empty");
        }

        if (voucher.minimumAmount <= 0) {
            errors.push("Minimum Amount must be greater than 0");
        }

        if (voucher.maxUsage <= 0) {
            errors.push("Max Usage must be greater than 0");
        }

        return errors;
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        const voucherData = {
            code: voucher.voucherCode,
            minimumAmount: voucher.minimumAmount,
            discount: voucher.discount,
            expiryDate: voucher.expiryDate,
            maxUsage: voucher.maxUsage,
            restaurant_id: restaurantId, // Replace with the actual restaurant id
            users: users,
        };

        // Replace with your actual API endpoint to create a voucher
        console.log("ennnno")
        axios.post('http://localhost:4010/api/voucher/addvoucher', voucherData)
            .then(response => {console.log(response.data)
                setVoucher({
                    voucherCode: "",
                    expiryDate: "",
                    minimumAmount: "",
                    discount: "",
                    maxUsage: "",
                },
                window.location.reload()
                );
            })
            .catch(error => console.error('Error:', error));

        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Voucher</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="voucherCode">
                        <Form.Label>Voucher Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter voucher code"
                            name="voucherCode"
                            value={voucher.voucherCode}
                            onChange={onChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="expiryDate">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="expiryDate"
                            value={voucher.expiryDate}
                            onChange={onChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="minimumAmount">
                        <Form.Label>Minimum Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter minimum amount"
                            name="minimumAmount"
                            value={voucher.minimumAmount}
                            onChange={onChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="discount">
                        <Form.Label>Discount Percentage</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Discount percentage"
                            name="discount"
                            value={voucher.discount}
                            onChange={onChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="maxUsage">
                        <Form.Label>Max Usage</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter max usage"
                            name="maxUsage"
                            value={voucher.maxUsage}
                            onChange={onChange}
                        />
                    </Form.Group>
                    <div className="modal-footer">
                        <Button variant="success" size="sm" onClick={handleAddSubmit}>
                            Add Voucher
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddVoucherModal;