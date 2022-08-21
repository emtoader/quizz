import http from "../http-common";

class QuizzDataService {
  getAll() {
    return http().get("/quizzes");
  }

  create(data, token) {

    const json = JSON.stringify(data)

    return http(token).post("/quizzes", json,{
      'Content-Type': 'application/json'
    });
  
  }

  calculateScore(data) {

    const json = JSON.stringify(data)

    return http().post("/calculate_quizz_score", json,{
      'Content-Type': 'application/json'
    });
  
  }
  
  delete(id,token) {
    return http(token).delete(`/quizzes/${id}`);
  }

  findBySlug(slug) {
    return http().get(`/quizz?slug=${slug}`);
  }

  getUserQuizzes(token) {
    return http(token).get(`/get_user_quizzes`);
  }
}
export default new QuizzDataService();