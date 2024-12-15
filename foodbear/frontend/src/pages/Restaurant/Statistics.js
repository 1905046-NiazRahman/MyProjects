import React, { useState, useEffect ,useRef} from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import axios from 'axios';
import Navbar_Restaurant from "../../components/Navbar_Restaurant";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const RestaurantSalesPage = () => {
  const [orderVolume, setOrderVolume] = useState(0);
  const [totalEarn, setTotalEarn] = useState(0);
  const [filter, setFilter] = useState('Days');
  const [mostPopularItem, setMostPopularItem] = useState(null);
  const restaurantId = localStorage.getItem("restaurant_id");
  const [totalUniqueClients, setTotalUniqueClients] = useState(0);
  const [otherRestaurantAvgOrder, setOtherRestaurantAverageOrderVolume] = useState(0);
  const [otherRestaurantAvgEarnings, setOtherRestaurantAverageEarning] = useState(0);

  const [orderData, setOrderData] = useState([]);
  const orderVolumeChartRef = useRef(null);
  const totalEarnChartRef = useRef(null);
  const orderVolumeChartInstance = useRef(null);
  const totalEarnChartInstance = useRef(null);

  useEffect(() => {
    fetchData();
  }, [filter]); // Fetch data whenever filter changes

  useEffect(() => {
    if (orderVolumeChartRef.current && totalEarnChartRef.current) {
      if (orderVolumeChartInstance.current) {
        orderVolumeChartInstance.current.destroy();
      }
      if (totalEarnChartInstance.current) {
        totalEarnChartInstance.current.destroy();
      }
      orderVolumeChartInstance.current = renderOrderVolumeChart(orderVolumeChartRef.current, orderData);
      totalEarnChartInstance.current = renderTotalEarnChart(totalEarnChartRef.current, orderData);
    }
  }, [orderData]);

  const renderOrderVolumeChart = (canvas, data) => {
    const labels = data.map(entry => entry.date);
    const volumes = data.map(entry => entry.orderVolume);

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Order Volume',
          data: volumes,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const renderTotalEarnChart = (canvas, data) => {
    const labels = data.map(entry => entry.date);
    const earnings = data.map(entry => entry.totalEarn);

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Earn',
          data: earnings,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4010/api/order/restaurant/orders/${restaurantId}`);
      const orders = response.data;
      const filteredOrders = filterOrdersByDate(orders);
      const volume = calculateOrderVolume(filteredOrders);
      const earn = calculateTotalEarn(filteredOrders);
      calculateMostPopularItem(filteredOrders).then(popularItem => setMostPopularItem(popularItem));
      setOrderVolume(volume);
      setTotalEarn(earn);

      const totalClients = calculateTotalUniqueClients(filteredOrders);
      setTotalUniqueClients(totalClients);

      const filteredOrders2 = filterOrdersByDate2(orders);
      const processedData = processData(filteredOrders2);
      setOrderData(processedData);

      const response2 = await axios.get(`http://localhost:4010/api/order/all/getAllOrders`);
      const allOrders = response2.data;
      const filteredOrders3 = filterOrdersByDate(allOrders);

      const otherRestaurantOrders = filteredOrders3.filter(order => {
        return order.restaurant_id !== restaurantId;
      });
      console.log("otherRestaurantOrders", otherRestaurantOrders);
      const otherRestaurantGroups = groupByRestaurant(otherRestaurantOrders);
      const otherRestaurantAverages = calculateAverages(otherRestaurantGroups);
      setOtherRestaurantAverageOrderVolume(otherRestaurantAverages.orderVolume);
      setOtherRestaurantAverageEarning(otherRestaurantAverages.earning);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterOrdersByDate = (orders) => {
    console.log("safari te")
    const currentDate = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      switch (filter) {
        case 'Days':
          return orderDate.getDate() === currentDate.getDate();
        case 'Weeks':
          return orderDate >= new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Orders within the last 7 days
        case 'Months':
          return orderDate >= new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        default:
          return true; // Return all orders if filter is not specified
      }
    });
    return filteredOrders;
  };

  const calculateOrderVolume = (orders) => {
    return orders.length;
  };

  const calculateTotalEarn = (orders) => {
    return orders.reduce((total, order) => total + order.total_price, 0);
  };

  const calculateMostPopularItem = async (orders) => {
    const itemCounts = orders.reduce((counts, order) => {
      order.food_items.forEach(item => {
        if (!counts[item.food_id]) {
          counts[item.food_id] = 0;
        }
        counts[item.food_id]++;
      });
      return counts;
    }, {});
  
    let mostPopularItemId = null;
    let maxCount = 0;
  
    for (const itemId in itemCounts) {
      if (itemCounts[itemId] > maxCount) {
        mostPopularItemId = itemId;
        maxCount = itemCounts[itemId];
      }
    }
  
    if (mostPopularItemId) {
      try {
        const response = await axios.get(`http://localhost:4010/api/order/user/food/${mostPopularItemId}`);
        return response.data.name;
      } catch (error) {
        console.error("Error fetching food item:", error);
      }
    }
  
    return null;
  };

  const calculateTotalUniqueClients = (orders) => {
    const uniqueUserIds = new Set(orders.map(order => order.user_id));
    return uniqueUserIds.size;
  };

  const filterOrdersByDate2 = (orders) => {
    const currentDate = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      switch (filter) {
        case 'Days':
          return orderDate.getDate() === currentDate.getDate() &&
                 orderDate.getMonth() === currentDate.getMonth() &&
                 orderDate.getFullYear() === currentDate.getFullYear();
        case 'Weeks':
          return isSameWeek(orderDate, currentDate);
        case 'Months':
          return orderDate >= new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000) && // Orders within the last 30 days
          orderDate.getFullYear() === currentDate.getFullYear(); // And the order year is the current year
        default:
          return true; // Return all orders if filter is not specified
      }
    });
  };

  const isSameWeek = (date1, date2) => {
    const diff = Math.abs(date1 - date2);
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    return diff <= millisecondsInWeek;
  };

  const processData = (orders) => {
    const groupedData = {};
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const formattedDate = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = {
          date: formattedDate,
          orderVolume: 0,
          totalEarn: 0
        };
      }
      groupedData[formattedDate].orderVolume++;
      groupedData[formattedDate].totalEarn += order.total_price;
    });
    return Object.values(groupedData);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const groupByRestaurant = (orders) => {
    return orders.reduce((groups, order) => {
      if (!groups[order.restaurant_id]) {
        groups[order.restaurant_id] = [];
      }
      groups[order.restaurant_id].push(order);
      return groups;
    }, {});
  };
  
  const calculateAverages = (groups) => {
    let totalOrderVolume = 0;
    let totalEarning = 0;
    let restaurantCount = 0;
  
    for (const restaurantId in groups) {
      const orders = groups[restaurantId];
      totalOrderVolume += calculateOrderVolume(orders);
      totalEarning += calculateTotalEarn(orders);
      restaurantCount++;
    }
  
    return {
      orderVolume: totalOrderVolume / restaurantCount,
      earning: totalEarning / restaurantCount
    };
  };

  return (
    <div >
      <Navbar_Restaurant />
      <div div className="container" style={{ position: "relative", top: "100px" }}>
        <Row>
          <Col md={12}>
            <div>
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{background:"#ff8a00",border:"none"}}>
                  {filter}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilter('Days')}>Days</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('Weeks')}>Weeks</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('Months')}>Months</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="mb-3 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Order Volume</Card.Title>
                <Card.Text>{orderVolume}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Total Earn</Card.Title>
                <Card.Text><span>&#2547;</span> {totalEarn}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Order Volume Graph</Card.Title>
                <canvas ref={orderVolumeChartRef}></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Total Earning Graph</Card.Title>
                <canvas ref={totalEarnChartRef}></canvas>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-3 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Popular Item</Card.Title>
                <Card.Text>{mostPopularItem}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Total Clients</Card.Title>
                <Card.Text>{totalUniqueClients}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Market Average Order Volume</Card.Title>
                <Card.Text>{otherRestaurantAvgOrder.toFixed(0)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4 mt-3 p-3 text-center shadow" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Market Average Earning</Card.Title>
                <Card.Text><span>&#2547;</span> {otherRestaurantAvgEarnings.toFixed(0)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RestaurantSalesPage;
