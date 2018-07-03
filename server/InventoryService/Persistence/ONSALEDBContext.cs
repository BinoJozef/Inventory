using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using InventoryService.Core.Models;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace InventoryService.Persistence
{
    public partial class ONSALEDBContext : DbContext
    {
        public virtual DbSet<OsStCustomers> OsStCustomers { get; set; }
        public virtual DbSet<OsStFlowlines> OsStFlowlines { get; set; }
        public virtual DbSet<OsStFlowmaster> OsStFlowmaster { get; set; }
        public virtual DbSet<OsStItemcategories> OsStItemcategories { get; set; }
        public virtual DbSet<OsStFlowtypes> OsStFlowtypes { get; set; }
        public virtual DbSet<OsStItems> OsStItems { get; set; }
        public virtual DbSet<OsStItemsubcategories> OsStItemsubcategories { get; set; }
        public virtual DbSet<OsStStatus> OsStStatus { get; set; }
        public virtual DbSet<OsCompanies> OsCompanies { get; set; }

        public ONSALEDBContext(DbContextOptions<ONSALEDBContext> options)
    : base(options)
        {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<OsCompanies>(entity =>
            {
                entity.ToTable("OS_COMPANIES");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Companycode)
                    .IsRequired()
                    .HasColumnName("COMPANYCODE")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Companyip)
                    .IsRequired()
                    .HasColumnName("COMPANYIP")
                    .HasMaxLength(40)
                    .IsUnicode(false);

                entity.Property(e => e.Companyname)
                    .IsRequired()
                    .HasColumnName("COMPANYNAME")
                    .HasMaxLength(30);

                entity.Property(e => e.Firmnr)
                    .IsRequired()
                    .HasColumnName("FIRMNR")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Lang)
                    .IsRequired()
                    .HasColumnName("LANG")
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.Linkedsrv)
                    .IsRequired()
                    .HasColumnName("LINKEDSRV")
                    .HasMaxLength(40)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<OsStCustomers>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.Code });

                entity.ToTable("OS_st_customers");

                entity.Property(e => e.Code)
                    .HasMaxLength(7)
                    .IsUnicode(false);

                entity.Property(e => e.BranchName)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.CustomerCategory)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Specode5)
                    .HasMaxLength(7)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<OsStFlowlines>(entity =>
            {
                entity.ToTable("OS_st_flowlines");

                entity.Property(e => e.ExecutedDate).HasColumnType("datetime");

                entity.Property(e => e.Note).HasMaxLength(70);

                entity.HasOne(d => d.Master)
                    .WithMany(p => p.OsStFlowlines)
                    .HasForeignKey(d => d.MasterId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_OS_st_flowlines_OS_st_flowmaster");
            });

            modelBuilder.Entity<OsStFlowmaster>(entity =>
            {
                entity.ToTable("OS_st_flowmaster");

                entity.Property(e => e.CompletedDate).HasColumnType("datetime");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerCode)
                    .HasMaxLength(7)
                    .IsUnicode(false);

                entity.Property(e => e.OldCustomerCode)
                   .HasMaxLength(7)
                   .IsUnicode(false);

                entity.Property(e => e.FinalItemCode)
                    .HasMaxLength(17)
                    .IsUnicode(false);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.OsStFlowmaster)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OS_st_flowmaster_OS_st_itemcategories");

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.OsStFlowmaster)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_flowmaster_OS_COMPANIES");

                entity.HasOne(d => d.FlowType)
                   .WithMany(p => p.OsStFlowmaster)
                   .HasForeignKey(d => d.FlowTypeId)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("FK_OS_st_flowmaster_OS_st_flowtypes");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.OsStFlowmaster)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_flowmaster_OS_st_status");

                entity.HasOne(d => d.SubCategory)
                    .WithMany(p => p.OsStFlowmaster)
                    .HasForeignKey(d => d.SubCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OS_st_flowmaster_OS_st_itemsubcategories");
            });

            modelBuilder.Entity<OsStItemcategories>(entity =>
            {
                entity.ToTable("OS_st_itemcategories");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(40);
                     
                
            });

            modelBuilder.Entity<OsStItems>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.Code });

                entity.ToTable("OS_st_items");

                entity.Property(e => e.Code)
                    .HasMaxLength(17)
                    .IsUnicode(false);

                entity.Property(e => e.AssignedTo)
                    .HasMaxLength(7)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.OsStItems)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_items_OS_st_itemcategories");

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.OsStItems)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_items_OS_COMPANIES");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.OsStItems)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_items_OS_st_status");

                entity.HasOne(d => d.SubCategory)
                    .WithMany(p => p.OsStItems)
                    .HasForeignKey(d => d.SubCategoryId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OS_st_items_OS_st_itemsubcategories");
            });

            modelBuilder.Entity<OsStItemsubcategories>(entity =>
            {
                entity.ToTable("OS_st_itemsubcategories");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.Cat)
                    .WithMany(p => p.OsStItemsubcategories)
                    .HasForeignKey(d => d.CatId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_OS_st_itemsubcategories_OS_st_itemcategories");
            });

            modelBuilder.Entity<OsStStatus>(entity =>
            {
                entity.ToTable("OS_st_status");

                entity.Property(e => e.StatusName)
                    .IsRequired()
                    .HasMaxLength(25);
            });

            modelBuilder.Entity<OsStFlowtypes>(entity =>
            {
                entity.ToTable("OS_st_flowtypes");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.Name).HasMaxLength(30);
            });
        }
    }
}
