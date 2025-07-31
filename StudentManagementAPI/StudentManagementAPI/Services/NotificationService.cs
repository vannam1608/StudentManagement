using AutoMapper;
using StudentManagementAPI.DTOs.Notification;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationService(INotificationRepository notificationRepository, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        // Lấy tất cả thông báo theo role
        public async Task<IEnumerable<NotificationDto>> GetAllAsync(string role)
        {
            var notifications = await _notificationRepository.GetAllByRoleAsync(role);
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        // Lấy thông báo theo ID
        public async Task<NotificationDto?> GetByIdAsync(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null) return null;
            return _mapper.Map<NotificationDto>(notification);
        }

        // Tạo mới thông báo, trả về true nếu thành công
        public async Task<bool> CreateAsync(CreateNotificationDto dto, int creatorId)
        {
            var newNotification = new Notification
            {
                Title = dto.Title,
                Content = dto.Content,
                TargetRole = dto.TargetRole,
                CreatedBy = creatorId,
                CreatedAt = DateTime.Now
            };

            await _notificationRepository.CreateAsync(newNotification);

            return newNotification.Id > 0;  // giả sử Id được set khi insert thành công
        }
    }
}
