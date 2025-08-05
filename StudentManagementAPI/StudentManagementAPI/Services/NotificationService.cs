using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.DTOs.Common;
using StudentManagementAPI.DTOs.Notification;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using StudentManagementAPI.Models.Common;

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

        public async Task<NotificationDto?> GetByIdAsync(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null) return null;
            return _mapper.Map<NotificationDto>(notification);
        }

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
            return newNotification.Id > 0;
        }

        public async Task<PaginatedResult<NotificationDto>> GetPagedAsync(PaginationQueryDto query)
        {
            var baseQuery = _notificationRepository.QueryAll()
                .OrderByDescending(n => n.Id); // ✅ Sắp xếp theo ID giảm dần

            var totalItems = await baseQuery.CountAsync();

            var items = await baseQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PaginatedResult<NotificationDto>
            {
                Data = items,
                TotalItems = totalItems,
                CurrentPage = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task<PaginatedResult<NotificationDto>> GetPagedByRoleAsync(string role, PaginationQueryDto query)
        {
            var baseQuery = _notificationRepository.QueryAll()
                .Where(n => n.TargetRole == role || n.TargetRole == "All")
                .OrderByDescending(n => n.Id); 

            var totalItems = await baseQuery.CountAsync();

            var items = await baseQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PaginatedResult<NotificationDto>
            {
                Data = items,
                TotalItems = totalItems,
                CurrentPage = query.Page,
                PageSize = query.PageSize
            };
        }
    }
}
