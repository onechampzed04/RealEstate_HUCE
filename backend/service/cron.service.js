import UserPackage from "../models/UserPackageModel.js";

export default class CronService {
  /**
   * Tác vụ này sẽ tìm tất cả các gói đang 'ACTIVE' và
   * NẠP LẠI 'remainingPosts' bằng đúng giá trị 'maxPostsPerDay' của gói đó.
   * Đồng thời reset 'postsToday' về 0.
   */
  async refreshDailyCredits() {
    try {
      console.log('CRON JOB [1/2]: Bắt đầu làm mới credit hàng ngày...');

      // 1. Tìm tất cả các gói người dùng đang ACTIVE và lấy thông tin chi tiết của gói cước (package)
      const activeUserPackages = await UserPackage.find({ 
        status: "ACTIVE" 
      }).populate('package');

      if (activeUserPackages.length === 0) {
        console.log('CRON JOB [1/2]: Không có gói active nào cần làm mới.');
        return;
      }

      // 2. Lặp qua từng gói để cập nhật
      for (const userPackage of activeUserPackages) {
        // Kiểm tra để đảm bảo gói cước liên quan không bị xóa
        if (userPackage.package) {
          // 3. Lấy hạn mức credit hàng ngày từ thông tin gói cước
          const dailyCreditAllowance = userPackage.package.maxPostsPerDay;

          // 4. Cập nhật lại số credit và reset bộ đếm
          userPackage.remainingPosts = dailyCreditAllowance;
          userPackage.postsToday = 0;

          // 5. Lưu lại thay đổi cho gói người dùng này
          await userPackage.save();
        }
      }

      console.log(`CRON JOB [1/2]: Đã làm mới credit thành công cho ${refreshedCount} gói cước.`);

    } catch (error) {
      console.error('CRON JOB [1/2]: Lỗi khi làm mới credit hàng ngày:', error);
    }
  }

  /**
   * Tác vụ này không thay đổi, vẫn kiểm tra và cập nhật các gói đã hết hạn.
   */
  async checkExpiredPackages() {
    try {
      console.log('CRON JOB [2/2]: Bắt đầu kiểm tra các gói cước đã hết hạn...');
      const now = new Date();
      const result = await UserPackage.updateMany(
        { 
          status: "ACTIVE",
          endDate: { $lte: now }
        },
        { $set: { status: "EXPIRED" } }
      );
      if (result.modifiedCount > 0) {
        console.log(`CRON JOB [2/2]: Đã cập nhật ${result.modifiedCount} gói cước hết hạn thành EXPIRED.`);
      } else {
        console.log('CRON JOB [2/2]: Không tìm thấy gói cước nào hết hạn.');
      }
    } catch (error) {
      console.error('CRON JOB [2/2]: Lỗi khi kiểm tra gói hết hạn:', error);
    }
  }
}