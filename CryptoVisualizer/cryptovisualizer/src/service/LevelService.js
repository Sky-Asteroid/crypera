import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/level'; // Замените на ваш базовый URL

class LevelService {
    // Метод для получения максимального уровня сопротивления
    static async findMaxHigh(symbol, interval) {
        try {
            const response = await axios.get(`${API_BASE_URL}/high-max`, {
                params: { symbol, interval }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching max high resistance level:', error);
            throw error;
        }
    }

    // Метод для получения наиболее частого уровня сопротивления
    static async findMostFrequentHigh(symbol, interval) {
        try {
            const response = await axios.get(`${API_BASE_URL}/frequent-high`, {
                params: { symbol, interval }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching most frequent high resistance level:', error);
            throw error;
        }
    }

    // Метод для получения уровней сопротивления по Фибоначчи
    static async findFibonacciLevels(symbol, interval) {
        try {
            const response = await axios.get(`${API_BASE_URL}/fibonacci-level`, {
                params: { symbol, interval }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Fibonacci resistance levels:', error);
            throw error;
        }
    }

    // Метод для получения уровней сопротивления на основе объемов
    static async findVolumeClusters(symbol, interval) {
        try {
            const response = await axios.get(`${API_BASE_URL}/volume-clusters`, {
                params: { symbol, interval }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching volume clusters resistance levels:', error);
            throw error;
        }
    }
}

export default LevelService;