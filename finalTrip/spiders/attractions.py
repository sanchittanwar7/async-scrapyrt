# -*- coding: utf-8 -*-
import scrapy
import requests


class AttractionsSpider(scrapy.Spider):
    name = 'attractions'
    allowed_domains = ['tripadvisor.in']

    def __init__(self, *args, **kwargs):
		super(AttractionsSpider, self).__init__(*args, **kwargs)
		self.query = ''
		self.sno = 0
		self.custom_url = ''

    def parse(self, response):
		urls = response.css('div.listing_title > a::attr(href)').extract()
		for url in urls:
			url = 'https://www.tripadvisor.in' + url
			try:
				self.custom_url = url.split(
				    'Reviews')[0] + 'Reviews%s' + url.split('Reviews')[1]
			except (IndexError):
				continue
			yield scrapy.Request(url=url, callback=self.parse_reviews)
		# self.sno += 30
		# self.query = 'oa%s-' % self.sno
		# url = self.url % (self.query)
		# yield scrapy.Request(url, callback=self.parse_page)

    def parse_reviews(self, response):
		reviews = response.css('div.review-container')
		print("------------------------------------------------------")
		print(response.css('h1#HEADING::text').extract_first())
		print("------------------------------------------------------")
		for review in reviews:
			yield{
			'hotel_name': response.css('h1#HEADING::text').extract_first(),
            'hotel_rating': response.css('.overallRating::text').extract_first(),
			'user_name' : review.css('div.info_text > div::text').extract_first(),
			'user_contribution' : review.css('span.badgetext::text').extract_first(),
			'heading' : review.css('span.noQuotes::text').extract_first(),
			'review' : review.css('p.partial_entry::text').extract_first()
			}
		# offset = response.css('a.next::attr(data-offset)').extract_first()
		# if offset != None:
		# 	print(offset)
		# 	next_page_url = self.custom_url % ('-or%s' % offset)
		# 	print(next_page_url)
		# 	yield scrapy.Request(url=next_page_url, callback=self.parse_reviews)
